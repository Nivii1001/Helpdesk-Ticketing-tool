const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

const router = express.Router();

// ==================== ADMIN-ONLY USER CREATION (REGISTER) ====================
router.post("/register", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validRoles = ["Admin", "User", "Support Agent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      // password: hashedPassword,
      password,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ==================== LOGIN ROUTE ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ message: "Login successful", token, user: { username: user.username, email: user.email, role: user.role } });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store **plain** token in DB (DO NOT hash it)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    await user.save();

    // Construct reset link
    const resetLink = `http://localhost:5173/ResetPassword/${resetToken}`;
    console.log("Reset Link Sent:", resetLink);

    // Setup email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    console.error("Error in forgetpassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ==================== RESET PASSWORD ===================//

router.post("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("User Before Password Update:", user);

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New Hashed Password Before Saving:", hashedPassword);

    user.password = hashedPassword; // Assign hashed password
    user.markModified("password"); // ✅ Ensure Mongoose detects the change

    // ✅ Remove reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // ✅ Save the user with the new password
    await user.save();

    // ✅ Fetch and log the stored hashed password after saving
    const updatedUser = await User.findById(user._id);
    console.log("Stored Hashed Password After Saving:", updatedUser.password);

    console.log("Password reset successful for:", user.email);
    
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Error in resetpassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users", authMiddleware,authorizeRoles("Admin"), async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Excludes passwords
    res.json(users);
  } catch (error) {
    console.error(" Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ==================== UPDATE USER ====================
router.put("/user/:id", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { username, role } = req.body;

    if (!username && !role) {
      return res.status(400).json({ message: "At least one field (name or role) must be provided" });
    }

    const validRoles = ["Admin", "User", "Support Agent"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(username && { username }), ...(role && { role }) },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== DELETE USER ====================
router.delete("/user/:id", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (req.user.id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Getting agents
router.get("/agents", async (req, res) => {
  try {
    const agents = await User.find({ role: "support Agent" }); // Assuming agents have role 'support'
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("Invalid Token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role-Based Access Control Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };

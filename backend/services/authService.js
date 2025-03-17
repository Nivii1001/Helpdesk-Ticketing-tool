const API_URL = "http://localhost:3000/api/auth";

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    // Store JWT token and role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    console.log("Login successful:", data);
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Logout User
// export const logoutUser = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   window.location.href = "/login"; // Redirect to login page
// };

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [userData, setUserData] = useState({ username: "", email: "", password: "", role: "User" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authorization failed. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage("User created successfully!");
        setUserData({ username: "", email: "", password: "", role: "User" });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error creating user.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <input name="username" placeholder="Username" value={userData.username} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input name="email" type="email" placeholder="Email" value={userData.email} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input name="password" type="password" placeholder="Password" value={userData.password} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <select name="role" value={userData.role} onChange={handleChange} className="w-full p-2 border rounded mb-2">
          <option value="User">User</option>
          <option value="Support Agent">Support Agent</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create User</button>
        {message && <p className="mt-2 text-center text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default AddUser;

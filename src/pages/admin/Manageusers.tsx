import React, { useState, useEffect } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdate = async (userId: string, updatedUser: any) => {
    setLoadingId(userId);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      setMessage({ text: "User updated successfully!", type: "success" });
      fetchUsers();
    } catch (error) {
      setMessage({ text: "Update failed.", type: "error" });
    }
    setLoadingId(null);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setMessage({ text: "User deleted successfully!", type: "success" });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setMessage({ text: "Delete failed.", type: "error" });
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole === "" || user.role === selectedRole)
    );
  });

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Manage Users</h2>

      <div className="flex flex-row items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 border rounded w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-1/4 mt-2 sm:mt-0"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Support Agent">Support Agent</option>
          <option value="User">User</option>
        </select>
      </div>

      {message && (
        <p className={`text-center mb-2 ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {message.text}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="border p-1 rounded"
                    value={user.username}
                    onChange={(e) => setUsers(users.map((u) => (u._id === user._id ? { ...u, username: e.target.value } : u)))}
                  />
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    className="border p-1 rounded"
                    value={user.role}
                    onChange={(e) => setUsers(users.map((u) => (u._id === user._id ? { ...u, role: e.target.value } : u)))}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="User">User</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleUpdate(user._id, { username: user.username, role: user.role })}
                  >
                    {loadingId === user._id ? "Updating..." : "Update"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && <p className="text-center text-gray-600 mt-4">No users found.</p>}
    </div>
  );
};

export default ManageUsers;

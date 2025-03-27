import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ⬇ Prevent navigating back after logout
  useEffect(() => {
    localStorage.removeItem("token"); // Ensure token is cleared on login page load
    localStorage.removeItem("user");

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      navigate("/login", { replace: true }); // Redirect to login if back button is pressed
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response Data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.user || !data.user.role) {
        throw new Error("Role not found in response.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Stored User Data:", localStorage.getItem("user"));

      if (data.user.role === "Admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (data.user.role === "User") {
        navigate("/UserDashboard", { replace: true });
      } else if (data.user.role === "Support Agent") {
        navigate("/SupportDashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("An error occurred while logging in.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-lg border bg-white p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Welcome!!!
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            Please login to your account
          </p>
        </CardHeader>
        <CardContent className="text-left">
          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 px-4 py-2"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 px-4 py-2"
                required
              />
              <a href="/forgetpassword" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-medium py-2 rounded-md text-lg"
            >
              Login
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

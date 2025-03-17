import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-lg border bg-white p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Forgot Password
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            Enter your email to reset your password
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-medium py-2 rounded-md text-lg"
            >
              Reset Password
            </Button>

            {message && <p className="text-center text-green-600 mt-4">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;

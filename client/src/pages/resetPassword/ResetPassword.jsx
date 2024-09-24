import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { url } from "../../backend";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (success || error) return;

    try {
      const res = await axios.patch(`${url}/auth/reset-password`, {
        password,
        id,
        token,
      });

      if (res.statusCode === res.ok) {
        setSuccess("Password reset successful!");
      } else {
        setError("Token is invalid or expired.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
    setTimeout(() => navigate("/home"), 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700" htmlFor="password">
              Enter your new password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

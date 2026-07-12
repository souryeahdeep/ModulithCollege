import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!studentId.trim() || !studentPassword.trim()) {
      setError("Both ID and password are required.");
      return;
    }

    setLoading(true);

    const url = `http://localhost:8080/api/student/login?studentId=${encodeURIComponent(
      studentId.trim(),
    )}&password=${encodeURIComponent(studentPassword.trim())}`;

    try {
      const response = await fetch(url, { method: "GET" });
      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json",
      );
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        const message =
          data?.message ||
          (response.status === 401 ? "Invalid name or ID." : "Login failed.");
        throw new Error(message);
      }
     
      console.log(data);
      alert(data?.message);

      navigate("/landing", {
        state: {
          studentId: data.data?.studentId || studentId.trim(),
          studentPassword: data.data?.password || studentPassword.trim(),
          details: data,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-6">
          Student Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Id
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your ID"
              autoComplete="on"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Password
            </label>
            <input
              type="password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your password"
              autoComplete="on"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

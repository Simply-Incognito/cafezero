import { useState } from "react";
import axios from "axios";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email, password },
        { withCredentials: true } // needed for session cookie
      );
      setMsg(res.data.message || "Logged in!");
    } catch (err) {
      setMsg(err.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={login} className="space-y-4">
        <input
          type="email"
          placeholder="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Log in
        </button>
        {msg && <p className="mt-2 text-center text-sm">{msg}</p>}
      </form>
    </section>
  );
}

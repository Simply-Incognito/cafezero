import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/user/profile", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.message ?? "Failed"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!profile) return <p>Loading…</p>;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(profile, null, 2)}</pre>
    </section>
  );
}

import { Routes, Route, Link, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
      <header className="p-4 bg-indigo-600 text-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">CafeZero</h1>
          <ul className="flex gap-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/auth">Auth</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          {/* catch‑all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

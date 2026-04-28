import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          Cafe<span>Zero</span>
        </Link>
        
        <div className="nav-search">
          <input type="text" placeholder="Search for food..." />
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li>
            <Link to="/cart" className="nav-cart">
              Cart <span className="cart-badge">{cartCount}</span>
            </Link>
          </li>
          {user ? (
            <li className="user-section">
              <div className="user-profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="avatar">
                  {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                </div>
                <span className="user-name">Hi, {user.firstname}</span>
                <i className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▾</i>
              </div>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)}>My Orders</Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-logout">Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li><Link to="/auth" className="login-btn-link">Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

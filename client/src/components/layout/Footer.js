import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Cafe<span>Zero</span>
          </Link>
          <p>Sip, Smile, Repeat. Your daily dose of premium caffeine and comfort, delivered to your doorstep.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Menu</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <div className="social-links">
              <span>Instagram</span>
              <span>Twitter</span>
              <span>Facebook</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CafeZero. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

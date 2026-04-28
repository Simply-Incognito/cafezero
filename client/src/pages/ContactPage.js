import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you shortly.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Contact <span>Us</span></h1>
        <p>Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <h3>Visit Us</h3>
            <p>123 Coffee Lane, Brew City<br />BC 45678, United Kingdom</p>
          </div>
          
          <div className="info-card">
            <h3>Email Us</h3>
            <p>hello@cafezero.com<br />support@cafezero.com</p>
          </div>

          <div className="info-card">
            <h3>Call Us</h3>
            <p>+1 (234) 567-890<br />Mon - Fri: 8am - 8pm</p>
          </div>
        </div>

        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="input-group-row">
              <div className="input-wrapper">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-wrapper">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-wrapper">
              <label>Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required 
              />
            </div>

            <div className="input-wrapper">
              <label>Message</label>
              <textarea 
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button type="submit" className="primary-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

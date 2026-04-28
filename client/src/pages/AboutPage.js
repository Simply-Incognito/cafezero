import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About <span>CafeZero</span></h1>
        <p>Beyond Coffee. A Zero-Compromise Experience.</p>
      </div>

      <div className="about-grid">
        <div className="about-image-section">
          <div className="about-image-card">
             {/* Imagine a premium coffee shop image here */}
             <div className="image-placeholder">☕</div>
          </div>
        </div>

        <div className="about-text-section">
          <h2>Our Story</h2>
          <p>Founded in 2024, CafeZero was born out of a simple realization: coffee shouldn't just be a caffeine kick—it should be a moment of pure bliss. We started as a small specialty roastery with a single mission: to eliminate the "zero" in quality and the "zero" in customer effort.</p>
          
          <div className="values-list">
            <div className="value-item">
              <h3>Ethically Sourced</h3>
              <p>We work directly with farmers to ensure the highest quality beans and fair trade practices.</p>
            </div>
            <div className="value-item">
              <h3>Artisan Roasting</h3>
              <p>Every batch is roasted to perfection by our master roasters in small quantities.</p>
            </div>
            <div className="value-item">
              <h3>Zero-Wait Delivery</h3>
              <p>Our sophisticated logistics ensure your coffee reaches you fresh and hot, every time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

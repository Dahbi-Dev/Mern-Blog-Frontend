import React from 'react';

function Footer() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <span style={{ color: 'orange' }}>© </span>
          {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

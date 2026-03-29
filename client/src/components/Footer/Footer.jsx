// client/src/components/Footer/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Elite<span>Mart</span></span>
          <p>Modern e-commerce, built with React &amp; Node.js.</p>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} EliteMart. All rights reserved.</p>
      </div>
    </footer>
  );
}

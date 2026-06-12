import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const footerSections = [
  {
    title: 'Company',
    links: ['About Us', 'Team', 'Careers', 'Blog'],
  },
  {
    title: 'Travel Info',
    links: ['Destinations', 'Booking Policy', 'FAQs', 'Travel Guides'],
  },
  {
    title: 'Legal',
    links: ['Terms of Service', 'Privacy Policy', 'Sitemap'],
  },
];

const SocialIcon = (props) => {
  const IconComponent = props.icon;
  return (
    <button className="social-btn">
      <IconComponent className="h-5 w-5" />
    </button>
  );
};

const Footer = () => {

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-logo-section">
            <h2 className="footer-logo">NEXT ROUTE</h2>
            <p>Book, explore, and enjoy—all in one place.</p>
            <div className="footer-socials">
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>


          {footerSections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((item) => (
                  <li key={item}>
                    <Link to="#">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} NEXT ROUTE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
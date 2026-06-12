import React, { useState } from 'react';
import { Map, Mail, Compass, User, LogOut, Shield } from 'lucide-react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import AuthPopup from './AuthPopup';
import './Navbar.css';



const navItems = [
  { name: 'Home', path: '/', icon: Map },
  { name: 'Booking', path: '#routes', icon: Map },
  { name: 'Must Visit', path: '#must-visit', icon: Compass },
  { name: 'About Us', path: '/about', icon: Map },
  { name: 'Contact', path: '/contact', icon: Mail },
  { name: 'Review', path: '#reviews', icon: Map },
];

const Navbar = () => {

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, handleLogout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (e, path) => {
    e.preventDefault();

    if (path.startsWith('#')) {

      const sectionId = path.replace('#', '');
      
      if (location.pathname === '/') {
        
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } else {
    
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container">

          <Link to="/" className="logo" onClick={() => window.scrollTo(0, 0)}>
            NEXT ROUTE
          </Link>

         
          <nav className="nav-links">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.path} 
                className="nav-item"
                onClick={(e) => handleNavigation(e, item.path)} 
                style={{cursor: 'pointer'}}
              >
                {item.name}
              </a>
            ))}


            {isAdmin && (
              <Link to="/admin" className="nav-item" style={{ color: '#FF8833' }}>
                <Shield className="w-4 h-4" style={{ display: 'inline', marginRight: '4px' }} />
                Admin
              </Link>
            )}


            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontSize: '0.9rem', opacity: 0.9 }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button 
                  className="login-btn" 
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="login-btn" 
                onClick={() => setIsAuthOpen(true)}
              >
                <User className="w-4 h-4" />
                Login / Signup
              </button>
            )}
          </nav>
        </div>
      </header>

      
      <AuthPopup 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </>
  );
};

export default Navbar;
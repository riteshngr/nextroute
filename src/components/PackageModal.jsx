import React, { useState, useEffect } from 'react';
import { apiGet } from '../services/api';
import './PackageModal.css';

const PackageModal = ({ destination, onClose, onSelect }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await apiGet(`/packages?destination=${encodeURIComponent(destination)}`);
        
        const transformed = data.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: `₹${pkg.price.toLocaleString()}`,
          priceNum: pkg.price,
          nights: pkg.nights,
          color: pkg.color,
          isPopular: pkg.popular,
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || []
        }));
        setPackages(transformed);
      } catch (err) {
        console.error("Failed to load packages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [destination]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <h3>Explore <span className="highlight-text">{destination}</span></h3>
            <p className="sub-text">Choose the perfect plan for your journey</p>
          </div>
          <button className="close-icon" onClick={onClose}>&times;</button>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Finding best packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-5 px-3">
            <h4 className="fw-bold mb-3" style={{ color: '#FF6B1A' }}>Oh, wanderer! 🌍</h4>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              We don't have pre-made packages for <strong>{destination}</strong> just yet, but we'd love to craft a personalised journey exclusively for you!
            </p>
            <button 
              className="btn btn-dark px-4 py-2" 
              style={{ borderRadius: '25px', fontWeight: 'bold' }}
              onClick={() => {
                alert("Our travel experts will contact you soon!");
                onClose();
              }}
            >
              Contact Us for a Custom Plan
            </button>
          </div>
        ) : (
          <div className="packages-container">
            {packages.map((pkg, index) => (
              <div key={index} className={`pkg-card ${pkg.isPopular ? 'popular-card' : ''}`}>
                
                {pkg.isPopular && <div className="badge">MOST POPULAR</div>}

                <div className={`card-header ${pkg.color}`}>
                  <h4 className="pkg-name">{pkg.name}</h4>
                  <h2 className="pkg-price">{pkg.price}</h2>
                  <p className="per-person">/ person</p>
                </div>

                <div className="card-body">
                  <ul className="pkg-features">
                    {pkg.features.map((f, i) => (
                      <li key={i}>
                        <span className="check-icon">✔</span> {f}
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`select-btn ${pkg.color}-btn`}
                    onClick={() => onSelect(pkg)}
                  >
                    Choose Plan
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PackageModal;
import React, { useState, useEffect } from "react";
import { apiGet } from '../services/api';
import "./SpecialOffers.css";




export default function SpecialOffers({ openOfferModal }) {
  const [hover, setHover] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await apiGet('/destinations/special-offers');
        const transformed = data.map((d, i) => ({
          id: d.id,
          place: d.name,
          img: typeof d.imageUrls === 'string' ? JSON.parse(d.imageUrls)[0] : (d.imageUrls?.[0] || ''),
          details: d.offerDetails || d.description,
          nights: d.nights || 0,
          oldPrice: d.oldPrice || 0,
          newPrice: d.newPrice || 0,
          side: ['left', 'center', 'right'][i % 3],
        }));
        if (transformed.length > 0) setOffers(transformed);
      } catch (err) {
        console.error("Failed to load special offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="offers-container">
      <h2 className="title">SPECIAL OFFERS &#9992;</h2>

      {loading ? (
        <div className="text-center w-100 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center w-100 py-5" style={{ color: 'white' }}>
          <p>No special offers currently available.</p>
        </div>
      ) : (
        <div className="offers-row">
          {offers.map((offer) => {
            const savings = offer.oldPrice - offer.newPrice;
            return (
              <div
                key={offer.id}
                className={`offer-card ${hover === offer.id ? "active" : ""} ${offer.side}`}
                onMouseEnter={() => setHover(offer.id)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="img-box">
                  <img src={offer.img} alt="" />
                  <h4 className="place">{offer.place}</h4>
                </div>

                <div className="details-box">
                  <h3>{offer.place}</h3>
                  <p>{offer.details}</p>

                  <p className="old-price">₹{offer.oldPrice.toLocaleString()}</p>
                  <p className="new-price">₹{offer.newPrice.toLocaleString()}</p>
                  <p className="save">Save ₹{savings.toLocaleString()}!</p>
                  <button
                    className="book-btn"
                    onClick={() => openOfferModal(offer)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
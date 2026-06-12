import React, { useState, useMemo } from 'react';
import './BookingModal.css';

export default function BookingModal({ offer, onClose, onSuccess }) {
  const isSpecialOffer = offer.isSpecialOffer;
  const nights = offer.nights || 0;
  const [persons, setPersons] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const basePrice = useMemo(() => {
    if (offer.newPrice) return offer.newPrice;
    if (offer.priceNum) return offer.priceNum;
    if (typeof offer.price === 'string') {
      const num = Number(offer.price.replace(/[₹,\s]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return offer.price || 0;
  }, [offer]);

  const totalPrice = basePrice * persons;

  const computedToDate = useMemo(() => {
    if (nights > 0 && fromDate) {
      const d = new Date(fromDate);
      d.setDate(d.getDate() + nights);
      return d.toISOString().split('T')[0];
    }
    return toDate;
  }, [fromDate, nights, toDate]);

  const validate = () => {
    const e = {};
    if (!fromDate) e.fromDate = 'Select a start date';
    if (!isSpecialOffer && !nights) {
      if (!toDate) e.toDate = 'Select an end date';
      if (fromDate && toDate && toDate <= fromDate) e.toDate = 'End date must be after start date';
    }
    if (persons < 1) e.persons = 'At least 1 person required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBook = () => {
    if (!validate()) return;
    const finalToDate = nights > 0 ? computedToDate : toDate;
    onSuccess({ persons, fromDate, toDate: finalToDate, totalPrice });
  };

  return (
    <div className="bm-overlay" onClick={onClose}>
      <div className="bm-box" onClick={e => e.stopPropagation()}>
        <button className="bm-close" onClick={onClose}>✕</button>

        <div className="bm-header">
          <span className="bm-tag">{isSpecialOffer ? 'Special Offer' : 'Package Booking'}</span>
          <h2 className="bm-destination">{offer.place || offer.name}</h2>
          {offer.details && <p className="bm-details">{offer.details}</p>}
          {nights > 0 && <p className="bm-nights">🌙 {nights} Nights</p>}
        </div>


        <div className="bm-price-section">
          <div className="bm-price-per-person">
            {offer.oldPrice && (
              <span className="bm-old">₹{offer.oldPrice?.toLocaleString()}</span>
            )}
            <span className="bm-base-label">₹{basePrice.toLocaleString()} <small>/ person</small></span>
          </div>
          <div className="bm-total-row">
            <span className="bm-total-label">Total ({persons} {persons === 1 ? 'person' : 'persons'})</span>
            <span className="bm-total-price">₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="bm-fields">
          <div className="bm-field">
            <label>Number of Persons</label>
            <input
              type="number"
              min="1"
              value={persons}
              onChange={e => { setPersons(Math.max(1, Number(e.target.value))); setErrors({ ...errors, persons: '' }); }}
              className={errors.persons ? 'bm-input bm-input-err' : 'bm-input'}
            />
            {errors.persons && <span className="bm-err">{errors.persons}</span>}
          </div>

          <div className="bm-field">
            <label>{nights > 0 ? 'Check-in Date' : 'From Date'}</label>
            <input
              type="date"
              min={today}
              value={fromDate}
              onChange={e => { setFromDate(e.target.value); setErrors({ ...errors, fromDate: '' }); }}
              className={errors.fromDate ? 'bm-input bm-input-err' : 'bm-input'}
            />
            {errors.fromDate && <span className="bm-err">{errors.fromDate}</span>}
          </div>


          {nights > 0 && fromDate && (
            <div className="bm-field">
              <label>Check-out Date</label>
              <input
                type="date"
                value={computedToDate}
                className="bm-input bm-input-disabled"
                disabled
              />
            </div>
          )}


          {!isSpecialOffer && !nights && (
            <div className="bm-field">
              <label>To Date</label>
              <input
                type="date"
                min={fromDate || today}
                value={toDate}
                onChange={e => { setToDate(e.target.value); setErrors({ ...errors, toDate: '' }); }}
                className={errors.toDate ? 'bm-input bm-input-err' : 'bm-input'}
              />
              {errors.toDate && <span className="bm-err">{errors.toDate}</span>}
            </div>
          )}
        </div>

        <button className="bm-confirm-btn" onClick={handleBook}>
          Confirm Booking • ₹{totalPrice.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

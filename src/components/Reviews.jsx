import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';





const starString = (rating) => '⭐'.repeat(rating);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiGet('/reviews?count=10');
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newText.trim()) {
      setSubmitError('Please write your review');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const newReview = await apiPost('/reviews', { rating: newRating, text: newText.trim() });
      setReviews(prev => [newReview, ...prev]);
      setNewText('');
      setNewRating(5);
      setShowForm(false);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="reviews-section">
      <h2 className="text-center fw-bold display-5 mb-3">🗣️ What Travelers Say</h2>

      {isLoggedIn && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(135deg, #FF8833, #FF6B1A)',
              border: 'none',
              color: '#fff',
              padding: '10px 25px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
            }}
          >
            {showForm ? '✕ Cancel' : '✍️ Write a Review'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="container" style={{ maxWidth: '500px', marginBottom: '30px' }}>
          <form onSubmit={handleSubmitReview} style={{
            background: '#1a1a2e',
            padding: '25px',
            borderRadius: '16px',
            color: '#fff',
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setNewRating(star)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.8rem',
                      opacity: star <= newRating ? 1 : 0.3,
                    }}
                  >⭐</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Review</label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Share your travel experience..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  resize: 'vertical',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            {submitError && <p style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{submitError}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #FF8833, #FF6B1A)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="text-center w-100 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center w-100 py-5" style={{ color: 'white' }}>
          <p>No reviews yet. Be the first to leave one!</p>
        </div>
      ) : (
        <div className="reviews-carousel">
          <div className="reviews-group">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
              <h1>{review.userName || review.name}</h1>
              <p className="stars">{starString(review.rating)}</p>
              <p className="review-text">"{review.text}"</p>
            </div>
          ))}
        </div>

          <div className="reviews-group" aria-hidden="true">
            {reviews.map((review) => (
              <div className="review-card" key={`dup-${review.id}`}>
                <h1>{review.userName || review.name}</h1>
                <p className="stars">{starString(review.rating)}</p>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
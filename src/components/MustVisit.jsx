import React, { useState, useRef, useEffect } from 'react'
import { apiGet } from '../services/api'

import './MustVisit.css' 



const MustVisit = ({ openBookingModal }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeImage, setActiveImage] = useState(""); 
  
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await apiGet('/destinations/must-visit');
        const transformed = data.map(d => ({
          id: d.id,
          name: d.name,
          location: d.location,
          price: d.price,
          desc: d.description,
          fullDetails: d.fullDetails,
          images: typeof d.imageUrls === 'string' ? JSON.parse(d.imageUrls) : d.imageUrls || [],
        }));
        if (transformed.length > 0) setPlaces(transformed);
      } catch (err) {
        console.error("Failed to load must-visit destinations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    const autoScroll = () => {
      if (!isDown && slider) {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth)) {
           slider.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(autoScroll);
    };
    animationRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDown]);


  const handleMouseDown = (e) => {
    setIsDown(true);
    sliderRef.current.classList.add('active');
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    cancelAnimationFrame(animationRef.current);
  };
  const handleMouseLeave = () => { setIsDown(false); sliderRef.current.classList.remove('active'); };
  const handleMouseUp = () => { setIsDown(false); sliderRef.current.classList.remove('active'); };
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const openDetails = (place) => {
    if(!isDown) {
        setSelectedPlace(place);
        setActiveImage(place.images[0]);
    }
  }

  
  const handleBookClick = () => {
    if (selectedPlace) {
        openBookingModal({ name: selectedPlace.name, price: selectedPlace.price });
        setSelectedPlace(null);
    }
  };

  return (
    <div className="py-5 bg-light">
      <div className="container mb-4">
        <h2 className="fw-bold display-5">🌟 Must Visit Destinations</h2>
        <p className="text-muted">Drag to explore. Click on a card to view details.</p>
      </div>

      
      <div 
        className="drag-container"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="drag-content">
          {loading ? (
            <div className="text-center w-100 py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : places.length === 0 ? (
            <div className="text-center w-100 py-5">
              <p className="text-muted">No must-visit destinations available right now.</p>
            </div>
          ) : (
            [...places, ...places, ...places, ...places].map((place, index) => (
              <div 
                key={index} 
                className="place-card" 
                onClick={() => openDetails(place)}
              >
                <img src={place.images[0]} alt={place.name} draggable="false" />
                
                <div className="card-overlay">
                    <h3 className="card-title">{place.name}</h3>
                    <span className="card-location">📍 {place.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-content-box shadow-lg" onClick={(e) => e.stopPropagation()}>
            
            <button className="close-btn" onClick={() => setSelectedPlace(null)}>
                &times;
            </button>
            
           
            <div className="modal-gallery">
              <div className="main-image-wrapper">
                 <img src={activeImage} alt="Main" className="main-image" />
              </div>
              <div className="thumbnails-strip">
                {selectedPlace.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="thumb" 
                      onClick={() => setActiveImage(img)}
                      className={`thumb-img ${activeImage === img ? 'active' : ''}`}
                    />
                ))}
              </div>
            </div>

         
            <div className="modal-details">
              <div className="mb-auto">
                <span className="badge bg-warning text-dark mb-2 px-3 py-2 rounded-pill">⭐ Top Rated</span>
                <h1 className="fw-bold display-5 mb-2">{selectedPlace.name}</h1>
                <h5 className="text-secondary mb-4">📍 {selectedPlace.location}</h5>
                <p className="lead text-muted place-desc">{selectedPlace.fullDetails}</p>
              </div>
              
              <div className="mt-4 pt-4 border-top">
                 <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                        <small className="text-muted text-uppercase fw-bold">Total Price</small>
                        <h2 className="text-success fw-bold m-0">{selectedPlace.price}</h2>
                    </div>
                 </div>

                
                 <button 
                    className="book-btn shadow-lg w-100 border-0" 
                    onClick={handleBookClick}
                 >
                   BOOK NOW
                 </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default MustVisit;
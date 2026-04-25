import React, { useState } from 'react';
import Hero from '../components/Hero';
import MustVisit from '../components/MustVisit';
import SpecialOffers from '../components/SpecialOffers';
import Reviews from '../components/Reviews';
import SearchSection from '../components/SearchSection';
import PackageModal from '../components/PackageModal';
import BookingModal from '../components/BookingModal';
import SuccessPopup from '../components/SuccessPopup';
import { apiGet, apiPost, isLoggedIn } from '../services/api';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchData, setSearchData] = useState({ destination: '', fromDate: '', toDate: '', people: 1 });
  const [bookings, setBookings] = useState([]);

  const [offerModal, setOfferModal] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const [mustVisitModal, setMustVisitModal] = useState(null);

  React.useEffect(() => {
    if (isLoggedIn()) {
      apiGet('/bookings')
        .then(data => {
          if (Array.isArray(data)) {
            const formatted = data.map(b => ({
              destination: b.destination,
              date: b.toDate ? `${b.fromDate} to ${b.toDate}` : b.fromDate,
              people: b.persons,
              packageName: b.packageName,
              price: `₹${b.totalPrice.toLocaleString()}`,
            }));
            setBookings(formatted);
          }
        })
        .catch(err => console.error("Failed to load bookings", err));
    }
  }, []);

  const handleSearch = (data) => {
    setSearchData(data);
    setShowModal(true);
  };

  const handlePackageSelect = async (pkg) => {
    const fromDateStr = searchData.fromDate || new Date().toISOString().split('T')[0];
    const dateRange = (searchData.fromDate && searchData.toDate)
      ? `${searchData.fromDate} to ${searchData.toDate}`
      : fromDateStr;

    const priceNum = typeof pkg.priceNum === 'number' 
        ? pkg.priceNum 
        : parseInt(pkg.price.replace(/[^0-9]/g, '') || '0');

    const newBooking = {
      destination: searchData.destination,
      fromDate: fromDateStr,
      toDate: searchData.toDate || null,
      persons: searchData.people,
      packageName: pkg.name,
      totalPrice: priceNum,
    };

    try {
      await apiPost('/bookings', newBooking);
      setBookings([...bookings, {
        name: 'Guest',
        destination: searchData.destination,
        date: dateRange,
        people: searchData.people,
        packageName: pkg.name,
        price: pkg.price,
      }]);
      setShowModal(false);
      setSuccessData({
        destination: searchData.destination,
        fromDate: fromDateStr,
        toDate: searchData.toDate || '',
        persons: searchData.people,
        packageName: pkg.name,
        price: pkg.price,
      });
    } catch (err) {
      alert(err.message || "Please login to book!");
    }
  };

  const handleMustVisitPackageSelect = (pkg) => {
    setShowModal(false);
    setOfferModal({
      name: mustVisitModal.name,
      price: pkg.price,
      priceNum: pkg.priceNum,
      nights: pkg.nights,
      details: pkg.name + ' — ' + pkg.features.join(', '),
      packageName: pkg.name,
    });
    setMustVisitModal(null);
  };

  const handleOfferBook = async (bookingInfo) => {
    const fromDateStr = bookingInfo.fromDate || new Date().toISOString().split('T')[0];
    const dateStr = bookingInfo.toDate 
      ? `${fromDateStr} to ${bookingInfo.toDate}` 
      : fromDateStr;
      
    const totalPriceStr = `₹${bookingInfo.totalPrice.toLocaleString()}`;
    const destinationName = offerModal.place || offerModal.name;
    const pkgName = offerModal.details || offerModal.packageName || 'Special Offer';

    const newBooking = {
      destination: destinationName,
      fromDate: fromDateStr,
      toDate: bookingInfo.toDate || null,
      persons: bookingInfo.persons,
      packageName: pkgName,
      totalPrice: bookingInfo.totalPrice,
    };

    try {
      await apiPost('/bookings', newBooking);
      setBookings([...bookings, {
        name: 'Guest',
        destination: destinationName,
        date: dateStr,
        people: bookingInfo.persons,
        packageName: pkgName,
        price: totalPriceStr,
      }]);
      setOfferModal(null);
      setSuccessData({
        destination: destinationName,
        fromDate: fromDateStr,
        toDate: bookingInfo.toDate || '',
        persons: bookingInfo.persons,
        packageName: pkgName,
        price: totalPriceStr,
      });
    } catch (err) {
      alert(err.message || "Please login to book!");
    }
  };

  return (
    <div>
      <Hero />

      <div id="routes">
        <SearchSection onSearch={handleSearch} />
      </div>

      {bookings.length > 0 && (
        <div className="container mt-4 mb-5">
          <h2 className="text-center fw-bold mb-3">Your Upcoming Trips</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Destination</th>
                  <th>Dates</th>
                  <th>People</th>
                  <th>Package</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, index) => (
                  <tr key={index}>
                    <td>{b.destination}</td>
                    <td>{b.date}</td>
                    <td>{b.people}</td>
                    <td>{b.packageName}</td>
                    <td className="text-success fw-bold">{b.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div id="must-visit">
        <MustVisit openBookingModal={(offer) => {
          setMustVisitModal(offer);
          setSearchData(prev => ({ ...prev, destination: offer.name }));
          setShowModal(true);
        }} />
      </div>

      <div style={{ marginTop: '0px', marginBottom: '0px' }}>
        <SpecialOffers openOfferModal={(offer) => setOfferModal({ ...offer, isSpecialOffer: true })} />
      </div>

      <div id="reviews">
        <Reviews />
      </div>

      {showModal && (
        <PackageModal
          destination={searchData.destination}
          onClose={() => { setShowModal(false); setMustVisitModal(null); }}
          onSelect={mustVisitModal ? handleMustVisitPackageSelect : handlePackageSelect}
        />
      )}

      {offerModal && (
        <BookingModal
          offer={offerModal}
          onClose={() => setOfferModal(null)}
          onSuccess={handleOfferBook}
        />
      )}

      {successData && (
        <SuccessPopup
          booking={successData}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
};

export default Home;
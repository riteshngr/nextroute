import React, { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost, apiDelete, isAdmin, getToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('destinations');
  
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [newDest, setNewDest] = useState({
    name: '', location: '', description: '', price: '', imageUrls: '[]', isMustVisit: false, isSpecialOffer: false, oldPrice: '', newPrice: '', nights: ''
  });
  
  const [newPkg, setNewPkg] = useState({
    destinationName: '', name: '', price: '', nights: 1, isPopular: false, features: '[]'
  });

  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [activeChatUserName, setActiveChatUserName] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadData() {
    try {
      const d = await apiGet('/admin/destinations');
      setDestinations(d);
      const p = await apiGet('/admin/packages');
      setPackages(p);
      const r = await apiGet('/reviews/all');
      setReviews(r);
      loadRooms();
    } catch (err) {
      console.error(err);
    }
  }

  async function loadRooms() {
    try {
      const r = await apiGet('/chat/rooms');
      setChatRooms(r);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadData();

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_BASE || 'http://localhost:8080/nextroute/ws/chat'),
      onConnect: () => {
        console.log("Admin WebSocket connected!");
        client.subscribe('/topic/admin.chats', (msg) => {
          loadRooms();
          const newMsg = JSON.parse(msg.body);
          setChatMessages(prev => {
            if (activeChatRoom === newMsg.roomId) {
              return [...prev, newMsg];
            }
            return prev;
          });
        });
      }
    });
    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    }
  }, [navigate, activeChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const openChatRoom = async (roomId, userName) => {
    setActiveChatRoom(roomId);
    setActiveChatUserName(userName || roomId);
    try {
      const history = await apiGet(`/chat/history?roomId=${roomId}`);
      setChatMessages(history);
    } catch(err) {
      console.error(err);
    }
  };

  const sendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChatRoom || !stompClient) {
      console.warn("Cannot send reply. Missing text, room, or client.");
      return;
    }
    
    if (!stompClient.connected) {
      console.warn("StompClient is not connected yet!");
    }

    try {
      stompClient.publish({
        destination: '/app/chat.reply',
        body: JSON.stringify({ token: getToken(), message: replyText, roomId: activeChatRoom })
      });
      setReplyText("");
    } catch (err) {
      console.error("Failed to publish message", err);
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...newDest, 
        imageUrls: newDest.imageUrls,
        oldPrice: newDest.oldPrice ? Number(newDest.oldPrice) : null,
        newPrice: newDest.newPrice ? Number(newDest.newPrice) : null,
        nights: newDest.nights ? Number(newDest.nights) : null,
        type: newDest.isSpecialOffer ? 'SPECIAL_OFFER' : 'MUST_VISIT'
      }; 
      await apiPost('/admin/destinations', payload);
      setNewDest({ name: '', location: '', description: '', price: '', imageUrls: '[]', isMustVisit: false, isSpecialOffer: false, oldPrice: '', newPrice: '', nights: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const token = getToken();
      const apiBase = import.meta.env.VITE_API_BASE || '/api';
      const res = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        setNewDest(prev => {
          const existing = JSON.parse(prev.imageUrls || '[]');
          return { ...prev, imageUrls: JSON.stringify([...existing, ...data.urls]) };
        });
      } else {
        alert(data.error || 'Failed to upload images');
      }
    } catch (err) {
      alert('Error uploading images');
    }
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setNewDest(prev => {
      const urls = JSON.parse(prev.imageUrls || '[]');
      const updated = urls.filter((_, i) => i !== indexToRemove);
      return { ...prev, imageUrls: JSON.stringify(updated) };
    });
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete review?')) {
      await apiDelete(`/reviews/${id}`);
      loadData();
    }
  };

  const handleDeleteDestination = async (id) => {
    if (window.confirm('Delete destination?')) {
      await apiDelete(`/admin/destinations/${id}`);
      loadData();
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...newPkg, 
        price: Number(newPkg.price),
        features: newPkg.features
      };
      await apiPost('/admin/packages', payload);
      setNewPkg({ destinationName: '', name: '', price: '', nights: 1, isPopular: false, features: '[]' });
      loadData();
    } catch (err) {
      alert("Error adding package: " + err.message);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Delete package?')) {
      await apiDelete(`/admin/packages/${id}`);
      loadData();
    }
  };

  if (!isAdmin()) return null;

  return (
    <div className="container py-5 mt-5">
      <h1 className="fw-bold mb-4">Admin Dashboard</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'destinations' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('destinations')}>
            Destinations
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'packages' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('packages')}>
            Packages
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'reviews' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('reviews')}>
            Reviews
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'chats' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('chats')}>
            Live Chats
          </button>
        </li>
      </ul>

      {activeTab === 'destinations' && (
        <div>
          <div className="card p-4 shadow-sm mb-4">
            <h4 className="mb-3">Add Destination</h4>
            <form onSubmit={handleAddDestination}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Name" value={newDest.name} onChange={e => setNewDest({...newDest, name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Location" value={newDest.location} onChange={e => setNewDest({...newDest, location: e.target.value})} required />
                </div>
                <div className="col-md-12">
                  <input className="form-control" placeholder="Price (e.g. ₹15,000)" value={newDest.price} onChange={e => setNewDest({...newDest, price: e.target.value})} required />
                </div>
                <div className="col-md-12">
                  <textarea className="form-control" placeholder="Description" value={newDest.description} onChange={e => setNewDest({...newDest, description: e.target.value})} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label mb-1">Upload Destination Images</label>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageUpload} />
                  {(() => {
                    const urls = JSON.parse(newDest.imageUrls || '[]');
                    if (urls.length === 0) return null;
                    return (
                      <div className="mt-2">
                        <small className="text-success d-block mb-2">{urls.length} image{urls.length !== 1 ? 's' : ''} attached</small>
                        <div className="d-flex flex-wrap gap-2">
                          {urls.map((url, idx) => {
                            const filename = url.split('/').pop();
                            return (
                              <div key={idx} className="position-relative border rounded p-1" style={{width: '110px'}}>
                                <img src={url} alt={filename} className="rounded" style={{width: '100%', height: '70px', objectFit: 'cover'}} />
                                <small className="d-block text-truncate text-muted" style={{fontSize: '0.65rem'}} title={filename}>{filename}</small>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                  style={{padding: '0 5px', fontSize: '0.7rem', lineHeight: '1.4', borderRadius: '50%', transform: 'translate(40%, -40%)'}}
                                  onClick={() => removeImage(idx)}
                                  title="Remove image"
                                >&times;</button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-2" checked={newDest.isMustVisit} onChange={e => setNewDest({...newDest, isMustVisit: e.target.checked})} /> Must Visit
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-2" checked={newDest.isSpecialOffer} onChange={e => setNewDest({...newDest, isSpecialOffer: e.target.checked})} /> Special Offer
                </div>

                {newDest.isSpecialOffer && (
                  <>
                    <div className="col-md-4">
                      <input type="number" className="form-control" placeholder="Old Price (Number)" value={newDest.oldPrice} onChange={e => setNewDest({...newDest, oldPrice: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <input type="number" className="form-control" placeholder="New Price (Number)" value={newDest.newPrice} onChange={e => setNewDest({...newDest, newPrice: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <input type="number" className="form-control" placeholder="Nights (Number)" value={newDest.nights} onChange={e => setNewDest({...newDest, nights: e.target.value})} />
                    </div>
                  </>
                )}
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-primary w-100">Add Destination</button>
                </div>
              </div>
            </form>
          </div>

          <h4>Existing Destinations</h4>
          <ul className="list-group">
            {destinations.map(d => (
              <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{d.name}</strong> - {d.location} ({d.price})
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDestination(d.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'packages' && (
        <div>
          <div className="card p-4 shadow-sm mb-4">
            <h4 className="mb-3">Add Package</h4>
            <form onSubmit={handleAddPackage}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Destination Name" value={newPkg.destinationName} onChange={e => setNewPkg({...newPkg, destinationName: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Package Name (e.g. Standard)" value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <input type="number" className="form-control" placeholder="Price (e.g. 5000)" value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <input type="number" className="form-control" placeholder="Nights" value={newPkg.nights} onChange={e => setNewPkg({...newPkg, nights: Number(e.target.value)})} required />
                </div>
                <div className="col-md-12">
                  <input className="form-control" placeholder='Features array (e.g. ["Breakfast", "WiFi"])' value={newPkg.features} onChange={e => setNewPkg({...newPkg, features: e.target.value})} />
                </div>
                <div className="col-md-12 d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-2" checked={newPkg.isPopular} onChange={e => setNewPkg({...newPkg, isPopular: e.target.checked})} /> Is Popular
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-primary w-100">Add Package</button>
                </div>
              </div>
            </form>
          </div>

          <h4>Existing Packages</h4>
          <ul className="list-group">
            {packages.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{p.name}</strong> for {p.destinationName} ({p.price})
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeletePackage(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h4 className="mb-3">All Reviews</h4>
          <ul className="list-group">
            {reviews.length === 0 && <li className="list-group-item text-muted">No reviews found.</li>}
            {reviews.map(r => (
              <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{r.userName}</strong> <span className="text-warning">{'⭐'.repeat(r.rating)}</span>
                  <br/>
                  <small className="text-muted">"{r.text}"</small>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="row">
          <div className="col-md-4">
            <h4 className="mb-3">Active Chats</h4>
            <ul className="list-group">
              {chatRooms.length === 0 && <li className="list-group-item text-muted">No active chats</li>}
              {chatRooms.map(r => (
                <li 
                  key={r.roomId} 
                  className={`list-group-item list-group-item-action ${activeChatRoom === r.roomId ? 'active' : ''}`}
                  onClick={() => openChatRoom(r.roomId, r.userName)}
                  style={{cursor: 'pointer'}}
                >
                  <strong>{r.userName || r.roomId}</strong> <br/>
                  <small className="text-truncate d-block">{r.message}</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-8">
            {activeChatRoom ? (
              <div className="card shadow-sm h-100 d-flex flex-column" style={{maxHeight: '600px'}}>
                <div className="card-header bg-primary text-white">
                  Chatting with {activeChatUserName || activeChatRoom}
                </div>
                <div className="card-body overflow-auto" style={{flex: 1, backgroundColor: '#f8f9fa'}}>
                  {chatMessages.map((m, idx) => {
                    const isAdminMsg = m.senderRole === 'ADMIN';
                    return (
                      <div key={idx} className={`mb-2 d-flex ${isAdminMsg ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-2 rounded ${isAdminMsg ? 'bg-primary text-white' : 'bg-light border'}`} style={{maxWidth: '75%'}}>
                           <small className="d-block" style={{fontSize: '0.7rem', opacity: 0.7}}>{m.senderName}</small>
                           {m.message}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="card-footer">
                  <form onSubmit={sendReply} className="d-flex gap-2">
                    <input className="form-control" placeholder="Type reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <button className="btn btn-primary" type="submit">Send</button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">Select a chat room to view messages.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

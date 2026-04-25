import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getUser, getToken, apiGet } from '../services/api';

const Contact = () => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [stompClient, setStompClient] = useState(null);
  
  const user = getUser();
  const token = getToken();
  const roomId = user ? `user_${user.id}` : null;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async () => {
    if (!user) {
      alert("Please login to use live chat!");
      return;
    }
    setShowChatPopup(true);

    try {
      const history = await apiGet(`/chat/history?roomId=${roomId}`);
      if (Array.isArray(history)) setMessages(history);
    } catch(err) {
      console.error("Failed to load chat history", err);
    }

    if (stompClient && stompClient.connected) return;

    const wsBase = import.meta.env.VITE_WS_BASE || 'http://localhost:8080/nextroute/ws/chat';
    const socket = new SockJS(wsBase);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        client.subscribe(`/topic/chat.${roomId}`, (msg) => {
          const newMsg = JSON.parse(msg.body);
          setMessages(prev => [...prev, newMsg]);
        });
      },
    });

    client.activate();
    setStompClient(client);
  };

  const closeAll = () => {
    setShowContactPopup(false);
    setShowChatPopup(false);
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !stompClient || !stompClient.connected) return;

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ token, message: inputMsg })
    });
    setInputMsg("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Get in Touch</h1>
      <p style={styles.subtitle}>How would you like to connect with us?</p>

      <div style={styles.buttonGroup}>
        <button style={styles.mainButton} onClick={() => setShowContactPopup(true)}>
          📞 Contact Us
        </button>
        <button style={styles.mainButton} onClick={openChat}>
          💬 Live Chat
        </button>
      </div>

      {showContactPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <button style={styles.closeButton} onClick={closeAll}>×</button>
            <h2>Contact Details</h2>
            <div style={styles.infoRow}><strong>Phone:</strong> +1 (555) 123-4567</div>
            <div style={styles.infoRow}><strong>Email:</strong> support@nextroute.com</div>
            <button style={styles.actionButton} onClick={closeAll}>Done</button>
          </div>
        </div>
      )}

      {showChatPopup && (
        <div style={styles.overlay}>
          <div style={styles.chatPopup}>
            <div style={styles.chatHeader}>
              <h3 style={{margin: 0, color: 'white'}}>Live Chat Support</h3>
              <button style={styles.chatCloseBtn} onClick={closeAll}>×</button>
            </div>
            
            <div style={styles.chatBody}>
              {messages.map((m, idx) => (
                <div key={idx} style={m.senderId === user?.id ? styles.msgRight : styles.msgLeft}>
                  <div style={m.senderId === user?.id ? styles.msgBubbleRight : styles.msgBubbleLeft}>
                    <small style={{display: 'block', opacity: 0.7, fontSize: '0.75rem', marginBottom: '2px'}}>
                      {m.senderName} ({m.senderRole})
                    </small>
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form style={styles.chatFooter} onSubmit={sendMessage}>
              <input 
                style={styles.chatInput} 
                value={inputMsg} 
                onChange={e => setInputMsg(e.target.value)} 
                placeholder="Type a message..." 
              />
              <button style={styles.sendBtn} type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '50px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  mainTitle: { fontSize: '2.5rem', color: '#333', marginBottom: '10px' },
  subtitle: { color: '#666', marginBottom: '40px', fontSize: '1.2rem' },
  buttonGroup: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' },
  mainButton: { padding: '15px 30px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.1s' },
  
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  popup: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  closeButton: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa' },
  infoRow: { margin: '15px 0', fontSize: '1.1rem', color: '#333', textAlign: 'left', paddingLeft: '20px' },
  actionButton: { marginTop: '10px', padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },

  chatPopup: { backgroundColor: '#f8f9fa', borderRadius: '12px', width: '90%', maxWidth: '450px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  chatHeader: { backgroundColor: '#007bff', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatCloseBtn: { background: 'none', border: 'none', fontSize: '28px', color: 'white', cursor: 'pointer', lineHeight: '1' },
  chatBody: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  msgLeft: { alignSelf: 'flex-start', maxWidth: '80%' },
  msgRight: { alignSelf: 'flex-end', maxWidth: '80%' },
  msgBubbleLeft: { backgroundColor: '#e9ecef', color: '#333', padding: '10px 15px', borderRadius: '15px 15px 15px 0' },
  msgBubbleRight: { backgroundColor: '#007bff', color: 'white', padding: '10px 15px', borderRadius: '15px 15px 0 15px' },
  chatFooter: { padding: '15px', backgroundColor: 'white', display: 'flex', gap: '10px', borderTop: '1px solid #ddd' },
  chatInput: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px', outline: 'none' },
  sendBtn: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }
};

export default Contact;
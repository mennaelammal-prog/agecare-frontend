import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [chatMessage, setChatMessage] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  async function sendChat(e) {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLoading(true);
    setChatReply('');
    try {
      const res = await api.post('/chat', { message: chatMessage });
      console.log('Chat response:', res.data);
      setChatReply(res.data.reply || res.data.message || 'No reply');
    } catch (err) {
      console.error('Chat error:', err);
      setChatReply('Error: ' + (err.response?.data?.error || 'Failed to get response'));
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Age Care Dashboard</h1>
        <button onClick={logout} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h3>Welcome, {user?.full_name || user?.name || 'User'}!</h3>
        <p>Email: {user?.email}</p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3>AI Health Assistant</h3>
        <form onSubmit={sendChat} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask a health question..."
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button type="submit" disabled={chatLoading} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {chatLoading ? '...' : 'Send'}
          </button>
        </form>
        {chatReply && (
          <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
            <strong>AI:</strong> {chatReply}
          </div>
        )}
      </div>
    </div>
  );
}
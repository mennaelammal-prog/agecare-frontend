import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('checkin');
  const [chatMessage, setChatMessage] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [checkinMood, setCheckinMood] = useState('');
  const [checkinNotes, setCheckinNotes] = useState('');
  const [checkinMsg, setCheckinMsg] = useState('');

  async function sendChat(e) {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLoading(true);
    setChatReply('');
    try {
      const res = await api.post('/chat', { message: chatMessage });
      setChatReply(res.data.reply || res.data.message || 'No reply');
    } catch (err) {
      setChatReply('Error: ' + (err.response?.data?.error || 'Failed to get response'));
    } finally {
      setChatLoading(false);
    }
  }

  async function submitCheckin(e) {
    e.preventDefault();
    try {
      await api.post('/checkin', { mood: checkinMood, notes: checkinNotes });
      setCheckinMsg('Check-in saved successfully!');
      setCheckinMood('');
      setCheckinNotes('');
    } catch (err) {
      setCheckinMsg('Error: ' + (err.response?.data?.error || 'Failed to save'));
    }
  }

  const tabs = [
    { id: 'checkin', label: 'Daily Check-in', icon: '✅' },
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'vitals', label: 'Vital Signs', icon: '🩺' },
    { id: 'history', label: 'History', icon: '📊' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', color: '#333' }}>🏥 Age Care App</h1>
        <button onClick={logout} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', background: 'white', borderBottom: '1px solid #eee', overflowX: 'auto', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#667eea' : '#f0f0f0',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '16px', marginRight: '4px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* DAILY CHECK-IN TAB */}
        {activeTab === 'checkin' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Daily Check-in</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>How are you feeling today?</p>
            
            <form onSubmit={submitCheckin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Mood</label>
                <select 
                  value={checkinMood} 
                  onChange={(e) => setCheckinMood(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '15px' }}
                >
                  <option value="">Select mood...</option>
                  <option value="Great">😊 Great</option>
                  <option value="Good">🙂 Good</option>
                  <option value="Okay">😐 Okay</option>
                  <option value="Not Good">😟 Not Good</option>
                  <option value="Bad">😢 Bad</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Notes</label>
                <textarea
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  placeholder="Any symptoms, concerns, or notes..."
                  rows={4}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '15px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" style={{ padding: '14px 28px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                Submit Check-in
              </button>
            </form>

            {checkinMsg && (
              <div style={{ marginTop: '16px', padding: '12px', background: checkinMsg.includes('Error') ? '#fee' : '#d4edda', color: checkinMsg.includes('Error') ? '#e74c3c' : '#155724', borderRadius: '8px' }}>
                {checkinMsg}
              </div>
            )}
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', height: '500px' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>AI Health Assistant</h2>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8f9fa', borderRadius: '12px', marginBottom: '16px' }}>
              {!chatReply && <p style={{ color: '#666', textAlign: 'center' }}>Ask me about health, wellness, or how you are feeling today.</p>}
              {chatReply && (
                <div style={{ padding: '15px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                  <strong>AI:</strong> {chatReply}
                </div>
              )}
            </div>

            <form onSubmit={sendChat} style={{ display: 'flex', gap: '10px' }}>
              <input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask a health question..."
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
              <button type="submit" disabled={chatLoading} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {chatLoading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        )}

        {/* MEDICATIONS TAB */}
        {activeTab === 'medications' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Medications</h2>
            <p style={{ color: '#666' }}>Medication tracking feature coming soon.</p>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Appointments</h2>
            <p style={{ color: '#666' }}>Appointment scheduling feature coming soon.</p>
          </div>
        )}

        {/* VITAL SIGNS TAB */}
        {activeTab === 'vitals' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Vital Signs</h2>
            <p style={{ color: '#666' }}>Track your blood pressure, heart rate, temperature, and more.</p>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>History</h2>
            <p style={{ color: '#666' }}>View your past check-ins and health history.</p>
          </div>
        )}
      </main>
    </div>
  );
}
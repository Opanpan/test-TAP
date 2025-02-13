import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/send',
        { message },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setStatus(response.data.message);
      setSentMessages((prev) => [...prev, message]);
      setMessage('');
      resetStatus();
    } catch (error) {
      setStatus('Error sending message');
      resetStatus();
    }
  };

  const resetStatus = () => {
    setTimeout(() => {
      setStatus('');
    }, 1500);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/messages');
      setReceivedMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '0 10%' }}>
      <h2>Message Queue</h2>

      <div className='container-content'>
        <div className='container-item'>
          <h3>Producer</h3>
          <input
            type='text'
            placeholder='Enter Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button style={{ marginLeft: '10px' }} onClick={sendMessage}>
            Send
          </button>
          <p>{status}</p>
          {sentMessages.length > 0 &&
            sentMessages?.map((msg, index) => <p key={index}>{msg}</p>)}
        </div>

        <div className='container-item'>
          <h3>Consumer</h3>
          {receivedMessages.length > 0 &&
            receivedMessages?.map((msg, index) => <p key={index}>{msg}</p>)}
        </div>
      </div>
    </div>
  );
}

export default App;

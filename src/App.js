import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [threadId, setThreadId] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);

  const baseURL = 'http://localhost:8000';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };



  const startConversation = () => {
    axios.get(`${baseURL}/start`)
      .then(response => {
        setThreadId(response.data.thread_id);
        setHasStarted(true);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const sendMessage = () => {
    if (message.trim()) {
      // Add user's message to chat history
      const updatedChatHistory = [...chatHistory, { user: 'You', message: message }];
      setChatHistory(updatedChatHistory);

      axios.post(`${baseURL}/chat`, { thread_id: threadId, message: message })
        .then(response => {
          // Add server's response to chat history
          setChatHistory([...updatedChatHistory, { user: 'Bot', message: response.data.response }]);
          setMessage(''); // Clear the message input
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  };

  return (
    <div className="chat-container">
      <button className="btn" onClick={startConversation}>Start Conversation</button>
      {hasStarted && (
        <>
          <div className="message-area">
  {chatHistory.map((msgObj, index) => (
    <div key={index} className="chat-message-row">
      <p className={`chat-message ${msgObj.user === 'You' ? 'user-message' : 'server-message'}`}>
        {msgObj.user}: {msgObj.message}
      </p>
      <button onClick={() => copyToClipboard(msgObj.message)} className="copy-btn">
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </div>
  ))}
</div>
          <div className="message-input-area">
            <input 
              type="text" 
              className="message-input" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Type your message..."
            />
            <button className="btn" onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

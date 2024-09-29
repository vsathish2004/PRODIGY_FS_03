import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [chattingUser, setChattingUser] = useState(null);
  const [isUsernamesSet, setIsUsernamesSet] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => socket.close();
  }, []);

  const handleSendMessage = () => {
    if (ws && input.trim() && isUsernamesSet) {
      const message = {
        sender: activeUser,
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      ws.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  const handleSetUsernames = () => {
    if (username1.trim() && username2.trim()) {
      setActiveUser(username1.trim()); // Default active user
      setChattingUser(username2.trim()); // Default chatting user
      setIsUsernamesSet(true);
    }
  };

  const handleSwitchUser = () => {
    setActiveUser((prev) => (prev === username1 ? username2 : username1));
    setChattingUser((prev) => (prev === username1 ? username2 : username1));
  };

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Real-Time Chat</h1>
        </header>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.sender === activeUser ? 'my-message' : 'other-message'}`}
            >
              <div className="message-content">
                <strong>{msg.sender}</strong>
                <p>{msg.content}</p>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {!isUsernamesSet ? (
          <div className="username-input-container">
            <input
              type="text"
              placeholder="Enter username for User 1"
              value={username1}
              onChange={(e) => setUsername1(e.target.value)}
              className="username-input"
            />
            <input
              type="text"
              placeholder="Enter username for User 2"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              className="username-input"
            />
            <button onClick={handleSetUsernames} className="set-username-button">Set Usernames</button>
          </div>
        ) : (
          <>
            <div className="user-switch">
              <button onClick={handleSwitchUser} className="switch-button">
                Switch User (Current: {activeUser})
              </button>
            </div>
            <div className="input-container">
              <input
                type="text"
                value={input}
                placeholder="Type a message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { tripId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/${tripId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/chat/send/${tripId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent("");
      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Trip Chat</h2>

      <div style={{ border: "1px solid gray", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.senderId.name}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
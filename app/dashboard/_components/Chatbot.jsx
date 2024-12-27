"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

function Chatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
    } catch (error) {
      console.error("Error generating answer:", error);
      setChatHistory((prev) => [...prev, { type: "answer", content: "Sorry - Something went wrong. Please try again!" }]);
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Chat"}
      </button>
      {isOpen && (
        <div className="chat-content">
          <div className="chat-history" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`message ${chat.type}`}>
                <ReactMarkdown>{chat.content}</ReactMarkdown>
              </div>
            ))}
            {generatingAnswer && (
              <div className="message answer">
                <div className="inline-block bg-black text-white p-3 rounded-lg animate-pulse">Thinking...</div>
              </div>
            )}
          </div>
          <form onSubmit={generateAnswer}>
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button type="submit" disabled={generatingAnswer}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
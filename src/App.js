/*
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBa8O3sFFQiL7aKGIAbPHfvqWwn6NugTwc"); // replace with your Gemini API key

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [{ sender: "bot", text: "Hi 👋 I'm BizAiHub. Ask me anything!" }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(input);
      const reply = result.response.text();

      typeBotMessage(reply, newMessages);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error: " + err.message },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  // Typing effect for bot
  const typeBotMessage = (text, newMessages) => {
    let i = 0;
    const typingMessage = { sender: "bot", text: "" };
    setMessages([...newMessages, typingMessage]);

    const interval = setInterval(() => {
      if (i < text.length) {
        typingMessage.text += text[i];
        setMessages([...newMessages, { sender: "bot", text: typingMessage.text }]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  return (
    <div
      className={`flex items-center justify-center h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
      }`}
    >
      <div
        className={`w-full max-w-2xl shadow-xl rounded-2xl p-6 flex flex-col h-[90vh] transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        
        <div className="flex justify-between items-center mb-4">
          <h1
            className={`text-3xl font-extrabold tracking-wide ${
              darkMode ? "text-purple-300" : "text-purple-600"
            }`}
          >
            🚀 BizAiHub
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded-full border text-sm transition hover:scale-105"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() =>
                setMessages([
                  { sender: "bot", text: "Chat cleared! 🚀 Ask me anything again." },
                ])
              }
              className="px-3 py-1 rounded-full border text-sm transition hover:scale-105"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto space-y-3 p-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white self-end ml-auto"
                  : darkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div
              className={`p-3 rounded-xl w-fit animate-pulse ${
                darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
              }`}
            >
              Thinking...
            </div>
          )}
        </div>

        
        <div className="mt-4 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className={`flex-1 p-3 border rounded-l-xl focus:outline-none ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
            }`}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-4 rounded-r-xl hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
***/


import React, { useState, useEffect, useRef } from "react";
import { Bot, Moon, Sun, Trash2, Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export default function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gemini API call
  const askGemini = async (prompt) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      return "⚠️ Error connecting to Gemini API.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Placeholder "typing" message
    const botTyping = { sender: "bot", text: "..." };
    setMessages((prev) => [...prev, botTyping]);

    const reply = await askGemini(input);

    setMessages((prev) => [
      ...prev.slice(0, -1), // remove typing
      { sender: "bot", text: reply },
    ]);
  };

  const handleClear = () => setMessages([]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl p-4">
        <div className="flex items-center gap-3">
          <Bot className="w-10 h-10 text-purple-500 drop-shadow-md animate-bounce" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            BizAIHub
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition"
          >
            <Trash2 />
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col p-4 h-[70vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-3 rounded-xl max-w-xs ${
              msg.sender === "user"
                ? "ml-auto bg-purple-500 text-white"
                : "mr-auto bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="w-full max-w-2xl flex items-center gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          <Send />
        </button>
      </div>
    </div>
  );
}

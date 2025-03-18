"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdHelpCircleOutline, IoMdSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Navbar from "@/app/Navbar/page";
import { v4 as uuidv4 } from 'uuid';
import { FiPlus } from "react-icons/fi";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1E1E1E] rounded-2xl p-4 shadow-lg ${className}`}>{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`h-72 overflow-auto text-sm leading-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    className={`bg-[#1E1E1E] hover:bg-[#141414] border-black text-white px-4 py-2 rounded-xl transition flex items-center justify-center space-x-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Textarea = ({ ...props }) => (
  <textarea
    className="bg-gray-800 text-white rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Playground = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string }[]>([]);
  const [chatHistory, setChatHistory] = useState<{ chatId: string; chatName: string; messages?: { text: string }[] }[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null); // State to track selected chat
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  interface ChatMessage {
    _id: string;
    sender: "user" | "bot";
    text: string;
  }


  interface GraphData {
    nodes: { id: string; type: string }[];
    links: { source: string; target: string }[];
  }

  const [graphData, setGraphData] = useState<GraphData | null>(null);
  useEffect(() => {
    const storedChatId = localStorage.getItem("chatId");
    if (storedChatId) {
      setSelectedChat(storedChatId);
    }
  }, []);

  const currentChatId = selectedChat || localStorage.getItem("chatId") || "e24f76c7-bd77-4197-8cb4-a74bc2a40c7b";


  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchChatHistories();
    }
  }, [selectedChat]);

  const apiURL = process.env.NEXT_PUBLIC_API_URL
  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    console.log(chatToDelete);


    try {
      const response = await fetch(`${apiURL}/chats/${chatToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove chat from UI after deletion
        setChatHistory((prevChats) => prevChats.filter((chat) => chat.chatId !== chatToDelete));
        setShowPopup(false);
        setChatToDelete(null);
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${apiURL}/chats`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("All Chats:", data);

      if (Array.isArray(data) && data.length > 0) {
        setChatHistory(
          data.map((chat) => ({
            chatId: chat.chatId,
            chatName: chat.messages.length > 0 ? chat.messages[0].text : "Unnamed Chat",
            messages: chat.messages,
          }))
        );
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  const fetchChatHistories = async () => {
    try {
      const response = await fetch(`${apiURL}/chats/${selectedChat}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      const data: { messages?: ChatMessage[] } = await response.json();
      console.log("Chat History Data:", data);

      if (data && data.messages) {
        setMessages(
          data.messages.map((msg: ChatMessage) => ({
            id: msg._id,
            sender: msg.sender,
            text: msg.text,
          }))
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setMessages([]);
    }
  };


  const fetchRAGResponse = async (userMessage: string) => {
    try {
      const response = await fetch("http://172.81.127.15:8000/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          database: "testdb",
          user_id: "cat10",
          qa_model_id: "openrouter/deepseek/deepseek-chat",
          qa_model_kwargs: {
            api_key: process.env.OPENAI_API_KEY,
            temperature: 0,
            max_tokens: 500,
          },
        }),
      });

      const data = await response.json();
      console.log("Full response from RAG API:", data);

      if (!response.ok) {
        console.error("RAG API Error:", data);
        return "RAG API is currently unavailable. Please try again later.";
      }

      const transactionHashes = data.answer.answer.match(/0x[a-fA-F0-9]{64}/g) || [];
      const address = (data.answer.answer.match(/0x[a-fA-F0-9]{40}/) || [])[0];

      if (address) {
        const nodes = [
          { id: address, type: "central" },
          ...transactionHashes.map((tx: string) => ({ id: tx, type: "transaction" })),
        ];

        const links = transactionHashes.map((tx: string) => ({
          source: tx,
          target: address,
        }));

        setGraphData({ nodes, links });
      }

      return data.answer.answer || "No answer provided.";
    } catch (error) {
      console.error("Error fetching RAG response:", error);
      return "There was an error fetching the response. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: userMessage }]);
    setQuery("");

    const thinkingMessage = { id: "thinking", sender: "bot", text: "Thinking..." };
    setMessages((prev) => [...prev, thinkingMessage]);

    const response = await fetchRAGResponse(userMessage);

    setMessages((prev) =>
      prev.filter((msg) => msg.id !== "thinking").concat({ id: Date.now().toString(), sender: "bot", text: response })
    );

    await sendChatToBackend(currentChatId, "user", userMessage);
    await sendChatToBackend(currentChatId, "bot", response);
  };

  const sendChatToBackend = async (chatId: string, sender: "user" | "bot", text: string) => {
    try {
      const response = await fetch(`${apiURL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, sender, text }),
      });

      if (!response.ok) {
        throw new Error("Failed to send chat data to the backend");
      }
      console.log("Message added:", await response.json());
    } catch (error) {
      console.error("Error saving chat to backend:", error);
    }
  };

  const handleNewChat = () => {
    const newChatId = uuidv4(); // Generate a new chat ID
    localStorage.setItem("chatId", newChatId); // Store new chat ID
    setSelectedChat(newChatId); // Update state
    setMessages([]); // Clear previous messages

    // Add new chat to chat history
    const newChat = { chatId: newChatId, chatName: `Chat ${chatHistory.length + 1}` };
    setChatHistory((prev) => [newChat, ...prev]);
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />

      {/* Main Container */}
      <div className="p-4 mt-16 flex flex-col lg:flex-row h-auto lg:h-screen space-y-4 lg:space-y-0 lg:space-x-4">

        {/* Sidebar - Chat History */}
        <div className="w-full lg:w-1/4 bg-[#1E1E1E] rounded-2xl p-4 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="AI Logo" className="w-8 h-8" />
              <h2 className="text-sm text-gray-500 font-semibold">Web3 Graph Index</h2>
            </div>
            <div className="flex space-x-3">
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md text-xs"
                onClick={handleNewChat}
              >
                <FiPlus className="text-lg" /> {/* Plus Icon */}
              </button>
              <FiSearch className="text-xl cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mb-4">
            <IoMdHelpCircleOutline className="text-xl cursor-pointer" />
            <BsThreeDotsVertical className="text-xl cursor-pointer" />
          </div>

          <h2 className="text-lg font-semibold text-white mb-2">Chat History</h2>

          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <div key={chat.chatId} className="relative group">
                <div
                  className={`flex items-center justify-between px-4 py-2 mb-2 rounded-lg cursor-pointer 
                                ${chat.chatId === currentChatId ? "bg-gray-500 text-white" : "bg-gray-400 hover:bg-gray-500"}`}
                  onClick={() => setSelectedChat(chat.chatId)}
                >
                  <span>{chat.chatName}</span>
                  <BsThreeDotsVertical
                    className="text-xl cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === chat.chatId ? null : chat.chatId);
                    }}
                  />
                </div>

                {menuOpen === chat.chatId && (
                  <div className="absolute right-2 mt-2 w-32 bg-gray-800 text-white rounded-lg shadow-lg p-2 z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setShowPopup(true);
                        setChatToDelete(chat.chatId);
                        setMenuOpen(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No chat history found</p>
          )}

          {/* Delete Confirmation Popup */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg">
                <h2 className="text-white text-lg mb-4">Are you sure you want to delete this chat?</h2>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteChat}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat & Messages Section */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-600 font-semibold">
              {selectedChat ? `Chat: ${selectedChat}` : "Select a Chat"}
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[75%] break-words w-fit
          ${msg.sender === "user" ? "bg-gray-700 text-white" : "bg-gray-800 text-white"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="relative flex items-center p-4 border-t border-gray-700 bg-[#1E1E1E]">
            <textarea
              className="flex-1 bg-transparent text-white border-none outline-none resize-none p-3 rounded-lg focus:ring-0"
              placeholder="Send a message..."
              value={query}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="absolute right-6 text-gray-400 hover:text-white"
              onClick={handleSendMessage}
            >
              <IoMdSend size={24} />
            </button>
          </div>
        </div>



        {/* Query Results Section (Only Show If graphData Exists) */}
        {graphData && Object.keys(graphData).length > 0 && (
          <div className="w-full lg:w-1/4 bg-[#1E1E1E] rounded-2xl p-4 shadow-lg relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Query Results</h2>
              <Button className="px-3 py-1 text-sm">JSON ⟳</Button>
            </div>

            <Card className="mt-4 h-64">
              <CardContent>
                <pre>{JSON.stringify(graphData, null, 2)}</pre>
              </CardContent>
            </Card>

            <button className="absolute bottom-4 right-4 bg-[#121212] text-white px-4 py-2 rounded-xl transition flex items-center justify-center space-x-2">
              Export
            </button>
          </div>
        )}

      </div>
    </div>

  );
};

export default Playground;

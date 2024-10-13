import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addResponse } from "../store/responseSlice";
import HistorySidebar from "./HistorySidebar";
import { auth, provider, signInWithPopup, signOut } from "../firebaseconfig";
import { FaBars } from "react-icons/fa";
import AdminPanel from "./AdminPanel";

type User = {
  name: string;
  uid: string;
  email: string;
} | null;

const Chatbot: React.FC = () => {
  const [user, setUser] = useState<User>(null);
  const [messages, setMessages] = useState<
    Array<{
      type: string;
      text?: string;
      summary?: string;
      result_text?: string;
      result_table_path?: string;
      result_visualization_path?: string;
      error?: string;
    }>
  >([]);
  const [query, setQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isResponseSaved, setIsResponseSaved] = useState<boolean>(false);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, uid, email } = result.user;
      setUser({
        name: displayName ?? "Unknown User",
        uid,
        email: email ?? "No email",
      });

      await axios.post("https://tg-postgres.onrender.com/api/saveUser", {
        uid,
        name: displayName,
        email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveResponse = async (botResponse: { result_text: string }) => {
    if (user) {
      try {
        await axios.post("https://tg-postgres.onrender.com/api/saveResponse", {
          text: botResponse.result_text,
          userId: user.uid,
        });
        alert("Response saved successfully!");
        setIsResponseSaved(true); // Mark response as saved
      } catch (error) {
        console.error("Error saving response:", error);
        alert("Failed to save response.");
      }
    } else {
      alert("You must be signed in to save responses.");
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => setUser(null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Create and set user message
    const userMessage = { type: "user", text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Save user message to local storage
    const savedResponses = JSON.parse(
      localStorage.getItem("responses") || "[]"
    );
    const newUserResponse = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
    };

    // Add user response to the array and update local storage
    savedResponses.push(newUserResponse);

    if (savedResponses.length > 30) {
      savedResponses.shift(); // Remove the oldest response (first in the array)
    }

    localStorage.setItem("responses", JSON.stringify(savedResponses));
    console.log("Saved Responses:", savedResponses); // Log saved responses

    // Dispatch the user response to Redux store
    dispatch(
      addResponse({ id: newUserResponse.id, text: newUserResponse.text })
    );

    try {
      // Make API call to get bot's response
      const response = await axios.post(
        "https://tg-postgres.onrender.com/api/chatbot",
        {
          query,
          userId: user?.uid,
        }
      );

      // Create bot message object
      const botMessage = {
        type: "bot",
        summary: response.data.summary,
        result_text: response.data.result_text,
        result_table_path: response.data.result_table_path,
        result_visualization_path: response.data.result_visualization_path,
        error: response.data.error,
      };

      // Update state with bot's response
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Do NOT save bot response to local storage or the responses array
      // Commented out to ensure it is not saved
      // const botResponse = {
      //   id: Date.now().toString(),
      //   text: botMessage.result_text || "Bot response",
      //   isUser: false,
      // };
      // savedResponses.push(botResponse); // This line should be removed
      // localStorage.setItem("responses", JSON.stringify(savedResponses)); // This line should be removed

      // Dispatch the bot's response to Redux store
      // dispatch(addResponse({ id: botResponse.id, text: botResponse.text })); // This line should be removed
    } catch (err) {
      // Handle error
      const errorMessage = {
        type: "bot",
        text: "Error fetching response from the API.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    // Clear the query input field
    setQuery("");
  };

  const handleSelectResponse = (response: { text: string }) => {
    setQuery(response.text);
    setIsResponseSaved(false); // Reset the save status when selecting a new response
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50 bg-stone-900 w-2/5 p-4 
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:fixed md:w-1/5`}
      >
        <HistorySidebar onSelect={handleSelectResponse} />
      </div>

      {/* Chatbox */}
      <div
        className={`flex-grow flex flex-col bg-stone-800 transition-transform duration-300 ease-in-out md:ml-[20%]`}
      >
        <div className="head-container bg-stone-800 text-white flex justify-between items-center p-4">
          <div className="flex items-center">
            {/* Menu Icon for Small Screens */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-white"
            >
              <FaBars />
            </button>
            <h1 className="text-2xl ml-2">Chatbot</h1>
          </div>

          {/* Admin Panel Button */}

          <div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={() => setIsAdminOpen(true)}
            >
              Admin Panel
            </button>

            {isAdminOpen && (
              <AdminPanel onClose={() => setIsAdminOpen(false)} />
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-xs text-white rounded-lg ${
                  message.type === "user"
                    ? "bg-gray-500"
                    : "bg-gray-400 text-black"
                }`}
              >
                {message.type === "bot" ? (
                  <>
                    {message.summary && (
                      <p>
                        <strong>Summary:</strong> {message.summary}
                      </p>
                    )}
                    {message.result_text && <p>{message.result_text}</p>}
                    {message.result_table_path && (
                      <a
                        href={message.result_table_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Table
                      </a>
                    )}
                    {message.result_visualization_path && (
                      <a
                        href={message.result_visualization_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Visualization
                      </a>
                    )}
                    <button
                      onClick={() => {
                        if (message.result_text) {
                          handleSaveResponse({
                            result_text: message.result_text,
                          });
                        }
                      }}
                      className={`ml-2 mt-3 ${
                        isResponseSaved
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-2 py-1 rounded`}
                      disabled={isResponseSaved} // Disable button if response is saved
                    >
                      {isResponseSaved ? "Response Saved" : "Save Response"}
                    </button>
                    {message.error && (
                      <p className="text-red-500">{message.error}</p>
                    )}
                  </>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <form
          className="bg-stone-800 p-4 flex h-[12%] mb-5"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex-grow border border-white-300 rounded-l-lg px-4 py-2 bg-stone-800 text-white"
            placeholder="Type your message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;

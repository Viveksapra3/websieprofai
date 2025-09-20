// "use client";
// import { createContext, useContext, useEffect, useState } from "react";

// const backendUrl ="http://localhost:3007";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState();
//   const [loading, setLoading] = useState(false);
//   const [cameraZoomed, setCameraZoomed] = useState(true);

//   const chat = async (message, language) => {
//     setLoading(true);
//     console.log("Message:", message, "Language:", language);
    
//     try {
//       const response = await fetch(`${backendUrl}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: message,
//           language: language,
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Received response:', data);
      
//       if (data.messages) {
//         setMessages((messages) => [...messages, ...data.messages]);
//       }
      
//       setLoading(false);
//       return data.messages || [];
//     } catch (error) {
//       console.error("Error calling backend API:", error);
//       setLoading(false);
//       return [];
//     }
//   };
  
//   const onMessagePlayed = () => {
//     setMessages((messages) => messages.slice(1));
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       setMessage(messages[0]);
//     } else {
//       setMessage(null);
//     }
//   }, [messages]);

//   return (
//     <ChatContext.Provider
//       value={{
//         chat,
//         message,
//         messages,
//         onMessagePlayed,
//         loading,
//         cameraZoomed,
//         setCameraZoomed,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };


// hooks/useChat.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_NEXT_BACK2_API;

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const chat = async (text, language) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return [];
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Expecting data.messages to be an array of message objects
      if (data.messages && Array.isArray(data.messages)) {
        setMessages((prev) => [...prev, ...data.messages]);
      } else if (data.message) {
        // fallback single message shape
        setMessages((prev) => [...prev, data.message]);
      }
      setLoading(false);
      return data.messages || [data.message].filter(Boolean);
    } catch (err) {
      console.error("Error calling backend API:", err);
      setLoading(false);
      return [];
    }
  };

  const onMessagePlayed = () => {
    // remove the first message after it has been played/acknowledged
    setMessages((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        messages,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

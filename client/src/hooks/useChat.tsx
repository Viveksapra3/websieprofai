import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Define the shape of a single message.
// You can adjust this interface according to your backend response.
interface ChatMessage {
  // Example properties (customize based on your API)
  id?: string;
  text?: string;
  role?: string;
  // or if it's just a string: message: string
  [key: string]: any;
}

// Define what context provides
interface ChatContextType {
  chat: (message: string) => Promise<void>;
  message: ChatMessage | null;
  onMessagePlayed: () => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
}

// Props for ChatProvider
interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<ChatMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraZoomed, setCameraZoomed] = useState<boolean>(true);

  const chat = async (msg: string): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });
      const resp: { messages: ChatMessage[] } = await data.json();
      setMessages((prev) => [...prev, ...resp.messages]);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
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

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
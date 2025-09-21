"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { Lipsync } from "wawa-lipsync";

const backendUrl = process.env.NEXT_PUBLIC_NEXT_WEB_API;

// Supported Languages Configuration
export const SUPPORTED_LANGUAGES = [
  { "code": "en-IN", "name": "English" },
  { "code": "hi-IN", "name": "Hindi" },
  { "code": "bn-IN", "name": "Bengali" },
  { "code": "mr-IN", "name": "Marathi" },
  { "code": "ta-IN", "name": "Tamil" },
  { "code": "te-IN", "name": "Telugu" },
  { "code": "kn-IN", "name": "Kannada" },
  { "code": "ml-IN", "name": "Malayalam" },
  { "code": "gu-IN", "name": "Gujarati" },
  { "code": "pa-IN", "name": "Punjabi" },
  { "code": "ur-IN", "name": "Urdu" }
];

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  
  // WebSocket state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connected', 'connecting', 'disconnected', 'reconnecting'
  const [audioChunks, setAudioChunks] = useState([]);
  const [chatHistory, setChatHistory] = useState([]); // For Experience component chat display
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const heartbeatIntervalRef = useRef(null);
  
  // Audio streaming state
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioElementRef = useRef(null);
  const currentMessageDataRef = useRef(null);

  // Convert HTTP backend URL to WebSocket URL
  const getWebSocketUrl = () => {
    if (!backendUrl) return 'ws://localhost:8765';
    
    try {
      const url = new URL(backendUrl);
      const wsProtocol = 'ws:';
      return `${wsProtocol}//${url.host}`;
    } catch (error) {
      console.error('Error parsing backend URL:', error);
      return 'ws://localhost:8765';
    }
  };

  // WebSocket message handlers
  const handleWebSocketMessage = useCallback((data) => {
    const messageType = data.type;
    
    // Display complete WebSocket response in terminal
    console.log('📨 WebSocket Response Received:');
    console.log('Message Type:', messageType);
    console.log('Complete Data:', JSON.stringify(data, null, 2));
    console.log('-----------------------------------');

    switch (messageType) {
      case 'connection_ready':
        console.log('🎉 AI Assistant ready:', data.services);
        setConnectionStatus('connected');
        break;

      case 'pong':
        console.log('🏓 WebSocket ping successful');
        break;

      case 'processing_started':
        setLoading(true);
        break;

      case 'message_start':
        // Initialize message data for streaming
        currentMessageDataRef.current = {
          text: data.text || '',
          animation: data.animation || 'Talking_1',
          facialExpression: data.facialExpression || 'smile',
          audioChunks: [],
          lipsync: null,
          audio: null
        };
        break;

      case 'text_response':
        if (data.text) {
          // For non-streaming text responses
          if (!currentMessageDataRef.current) {
            currentMessageDataRef.current = {
              text: data.text,
              animation: data.animation || 'Talking_1',
              facialExpression: data.facialExpression || 'smile',
              audioChunks: [],
              lipsync: null,
              audio: null
            };
          } else {
            currentMessageDataRef.current.text = data.text;
          }
          
          // Don't add to chat history immediately for text-only messages either
          // Wait for the Avatar to finish displaying the text
          
          // If no audio is expected, create message immediately for Avatar
          if (!data.hasAudio && !data.audio_generation_started) {
            const textOnlyMessage = {
              text: data.text,
              animation: "Talking_1",
              facialExpression: data.facialExpression || 'smile',
              lipsync: null,
              audio: null,
              isTextOnly: true,
              messageText: data.text, // Store for later chat display
              resolve: currentMessageDataRef.current?.resolve
            };
            setMessages(prev => [...prev, textOnlyMessage]);
          }
        }
        break;

      case 'audio_generation_started':
        setLoading(true);
        audioQueueRef.current = [];
        isPlayingAudioRef.current = false;
        break;

      case 'audio_chunk':
        try {
          handleAudioChunk(data);
        } catch (error) {
          console.error('❌ Error handling audio chunk:', error);
          console.error('Audio chunk data:', data);
        }
        break;

      case 'audio_generation_complete':
      case 'audio_complete':
        handleAudioComplete(data);
        break;

      case 'error':
        console.error('WebSocket error:', data.error);
        setLoading(false);
        break;

      default:
        console.log('Unknown message type:', messageType, data);
        break;
    }
  }, []);

  // Handle audio chunk processing
  const handleAudioChunk = useCallback(async (data) => {
    // Initialize message data if it doesn't exist
    if (!currentMessageDataRef.current) {
      console.log('🎵 Initializing message data for audio chunk');
      currentMessageDataRef.current = {
        text: '',
        animation: "Talking_1",
        facialExpression: 'smile',
        audioChunks: [],
        lipsync: null,
        audio: null
      };
    }

    console.log('🎵 Received audio chunk:', {
      sequence: data.sequence || data.chunk_id || 0,
      isLast: data.isLast || data.is_last || false,
      dataLength: data.audio_data?.length || 0,
      hasLipsync: !!data.lipsync
    });

    // Generate lipsync for this individual chunk if not provided by backend
    let chunkLipsync = data.lipsync || null;
    if (!chunkLipsync && data.audio_data) {
      console.log('🎭 Generating lipsync for individual chunk...');
      try {
        chunkLipsync = await generateLipsyncData(data.audio_data);
      } catch (error) {
        console.error('❌ Error generating chunk lipsync:', error);
      }
    }

    // Create chunk message for Avatar
    const chunkMessage = {
      type: 'audio_chunk',
      text: currentMessageDataRef.current.text,
      animation: "Talking_1",
      facialExpression: currentMessageDataRef.current.facialExpression || 'smile',
      audio: data.audio_data,
      lipsync: chunkLipsync,
      sequence: data.sequence || data.chunk_id || 0,
      isLast: data.isLast || data.is_last || false,
      isChunk: true
    };

    // Send chunk directly to Avatar for immediate playback
    setMessages(prev => [...prev, chunkMessage]);

    // Store chunk for potential fallback processing
    const audioChunk = {
      data: data.audio_data,
      sequence: data.sequence || data.chunk_id || 0,
      isLast: data.isLast || data.is_last || false,
      lipsync: chunkLipsync
    };

    // Ensure audioChunks array exists
    if (!currentMessageDataRef.current.audioChunks) {
      currentMessageDataRef.current.audioChunks = [];
    }
    
    currentMessageDataRef.current.audioChunks.push(audioChunk);
    setAudioChunks(prev => [...prev, audioChunk]);

    // If this is the last chunk, finalize the message
    if (audioChunk.isLast) {
      console.log('🎬 Last chunk received, finalizing message');
      // Add to chat history now that all chunks are processed
      if (currentMessageDataRef.current.text) {
        setChatHistory(prev => [...prev, { role: 'assistant', text: currentMessageDataRef.current.text }]);
      }
      
      // Resolve promise if exists
      if (currentMessageDataRef.current.resolve) {
        currentMessageDataRef.current.resolve([currentMessageDataRef.current.text]);
      }
      
      currentMessageDataRef.current = null;
    }
  }, []);

  // Handle audio completion (simplified since chunks are handled individually)
  const handleAudioComplete = useCallback((data) => {
    setLoading(false);
    console.log('🎬 Audio generation complete');
  }, []);

  // Combine audio chunks by sequence
  const combineAudioChunks = (chunks) => {
    if (!chunks || chunks.length === 0) {
      console.log('⚠️ No audio chunks to combine');
      return '';
    }
    
    console.log('🎵 Combining audio chunks:', chunks.length);
    
    // Sort by sequence number
    const sortedChunks = chunks.sort((a, b) => a.sequence - b.sequence);
    
    // Validate chunks have data
    const validChunks = sortedChunks.filter(chunk => {
      if (!chunk.data || typeof chunk.data !== 'string') {
        console.warn('⚠️ Invalid chunk data:', chunk);
        return false;
      }
      return true;
    });
    
    console.log('🎵 Valid chunks:', validChunks.length);
    
    // Combine base64 data
    const combinedData = validChunks.map(chunk => chunk.data).join('');
    
    console.log('🎵 Combined audio data length:', combinedData.length);
    console.log('🎵 First 50 chars:', combinedData.substring(0, 50));
    
    return combinedData;
  };

  // Generate lipsync data using wawa-lipsync
  const generateLipsyncData = async (audioBase64) => {
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      console.log('⚠️ No valid audio data for lipsync generation');
      return null;
    }
    
    // Clean base64 string (remove whitespace but keep valid base64 chars)
    const cleanBase64 = audioBase64.replace(/\s/g, '');
    
    // Basic validation - check if it looks like base64
    if (cleanBase64.length === 0) {
      console.error('❌ Empty audio data');
      return null;
    }
    
    console.log('🎵 Base64 validation passed, length:', cleanBase64.length);
    
    try {
      console.log('🎵 Generating lipsync data from MP3 audio...');
      console.log('🎵 Audio base64 length:', audioBase64.length);
      
      // Convert base64 to blob with proper MP3 MIME type
      const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
      console.log('🎵 MP3 Audio blob created, size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        console.error('❌ Audio blob is empty');
        return null;
      }
      
      // Create a File object from the blob (wawa-lipsync works better with File objects)
      const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
      console.log('🎵 MP3 File created:', audioFile.name, audioFile.size);
      
      // Generate lipsync using wawa-lipsync with the MP3 file
      const lipsync = new Lipsync();
      
      // Debug: Log available methods
      console.log('🔍 Available Lipsync methods:', Object.getOwnPropertyNames(lipsync));
      console.log('🔍 Lipsync prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(lipsync)));
      
      // Try different methods based on wawa-lipsync API
      let lipsyncData;
      try {
        // Try various method names that might exist in wawa-lipsync
        if (typeof lipsync.lipSync === 'function') {
          console.log('🎵 Using lipSync method');
          lipsyncData = await lipsync.lipSync(audioFile);
        } else if (typeof lipsync.fromAudioFile === 'function') {
          console.log('🎵 Using fromAudioFile method');
          lipsyncData = await lipsync.fromAudioFile(audioFile);
        } else if (typeof lipsync.generateLipsync === 'function') {
          console.log('🎵 Using generateLipsync method');
          lipsyncData = await lipsync.generateLipsync(audioFile);
        } else if (typeof lipsync.process === 'function') {
          console.log('🎵 Using process method');
          lipsyncData = await lipsync.process(audioFile);
        } else if (typeof lipsync.analyze === 'function') {
          console.log('🎵 Using analyze method');
          lipsyncData = await lipsync.analyze(audioFile);
        } else if (typeof lipsync.generate === 'function') {
          console.log('🎵 Using generate method');
          lipsyncData = await lipsync.generate(audioFile);
        } else {
          console.log('🎵 No known method found, trying lipSync with blob');
          lipsyncData = await lipsync.lipSync(audioBlob);
        }
      } catch (methodError) {
        console.log('🔄 Method failed, trying with blob:', methodError.message);
        try {
          lipsyncData = await lipsync.lipSync(audioBlob);
        } catch (blobError) {
          console.log('🔄 Blob method also failed, trying direct call:', blobError.message);
          // Try calling the lipsync object directly
          lipsyncData = await lipsync(audioFile);
        }
      }
      
      console.log('🎵 Lipsync data generated:', lipsyncData);
      console.log('🎵 Mouth cues count:', lipsyncData?.mouthCues?.length || 0);
      
      return lipsyncData;
    } catch (error) {
      console.error('❌ Error generating lipsync:', error);
      console.error('Audio data sample:', audioBase64.substring(0, 100));
      
      // Try alternative approach with different MIME type
      try {
        console.log('🔄 Trying alternative MIME type...');
        const audioBlob = base64ToBlob(audioBase64, 'audio/mpeg');
        const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });
        
        const lipsync = new Lipsync();
        let lipsyncData;
        
        // Try the same methods with alternative MIME type
        if (typeof lipsync.lipSync === 'function') {
          lipsyncData = await lipsync.lipSync(audioFile);
        } else if (typeof lipsync.fromAudioFile === 'function') {
          lipsyncData = await lipsync.fromAudioFile(audioFile);
        } else {
          lipsyncData = await lipsync.lipSync(audioBlob);
        }
        
        console.log('🎵 Alternative lipsync generation successful');
        return lipsyncData;
      } catch (altError) {
        console.error('❌ Alternative lipsync generation also failed:', altError);
        
        // Create fallback lipsync data for basic mouth movement
        console.log('🔄 Creating fallback lipsync data...');
        return createFallbackLipsync(audioBase64);
      }
    }
  };

  // Create fallback lipsync data when wawa-lipsync fails
  const createFallbackLipsync = (audioBase64) => {
    try {
      // Estimate audio duration based on base64 length (rough approximation)
      const estimatedDuration = Math.max(1, audioBase64.length / 50000); // Rough estimate
      
      // Create basic mouth movement pattern
      const mouthCues = [];
      const visemes = ['A', 'E', 'I', 'O', 'U', 'B', 'C', 'D']; // Basic viseme set
      const segmentDuration = estimatedDuration / 8; // Divide into segments
      
      for (let i = 0; i < 8; i++) {
        const start = i * segmentDuration;
        const end = (i + 1) * segmentDuration;
        const viseme = visemes[i % visemes.length];
        
        mouthCues.push({
          start: start,
          end: end,
          value: viseme
        });
      }
      
      console.log('🎭 Created fallback lipsync with', mouthCues.length, 'mouth cues');
      
      return {
        mouthCues: mouthCues,
        metadata: {
          duration: estimatedDuration,
          type: 'fallback'
        }
      };
    } catch (error) {
      console.error('❌ Error creating fallback lipsync:', error);
      return null;
    }
  };

  // Convert base64 to blob
  const base64ToBlob = (base64, mimeType) => {
    try {
      // Remove only whitespace, keep all valid base64 characters including +, /, =
      const cleanBase64 = base64.replace(/\s/g, '');
      
      // Ensure proper padding
      const paddedBase64 = cleanBase64 + '='.repeat((4 - cleanBase64.length % 4) % 4);
      
      console.log('🔧 Processing base64 length:', paddedBase64.length);
      console.log('🔧 First 20 chars:', paddedBase64.substring(0, 20));
      
      const byteCharacters = atob(paddedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error('❌ Error in base64ToBlob:', error);
      console.error('Base64 string length:', base64?.length || 0);
      console.error('First 100 chars:', base64?.substring(0, 100) || 'empty');
      throw error;
    }
  };

  // Simplified audio cleanup (no longer managing playback queue)
  const stopAudioPlayback = () => {
    // Clear any remaining audio chunks
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    console.log('🔇 Audio playback stopped (handled by Avatar)');
  };

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    const wsUrl = getWebSocketUrl();
    console.log('🔗 Connecting to WebSocket:', wsUrl);
    setConnectionStatus('connecting');
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        startHeartbeat();
        
        // Send initial ping
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 1000);
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          console.log('📥 Raw WebSocket Message Received:', event.data);
          const data = JSON.parse(event.data);
          
          // Validate message structure
          if (!data || typeof data !== 'object') {
            console.error('❌ Invalid message structure:', data);
            return;
          }
          
          handleWebSocketMessage(data);
        } catch (e) {
          console.error('❌ Error parsing WebSocket message:', e);
          console.error('Raw message data:', event.data);
          console.error('Stack trace:', e.stack);
        }
      };
      
      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        stopHeartbeat();
        stopAudioPlayback();
        
        // Auto-reconnect for unexpected closures
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionStatus('reconnecting');
          setTimeout(() => connectWebSocket(), 2000 * reconnectAttemptsRef.current);
        } else if (event.code === 1000) {
          setConnectionStatus('disconnected');
          console.log('🔌 Normal WebSocket closure - not reconnecting');
        } else {
          setConnectionStatus('disconnected');
          console.error('Max reconnection attempts reached');
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('disconnected');
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  }, [handleWebSocketMessage]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Normal closure');
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    stopHeartbeat();
    stopAudioPlayback();
  }, []);

  // Heartbeat mechanism
  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
        console.log('🏓 Heartbeat ping sent');
      } else {
        stopHeartbeat();
      }
    }, 30000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  // WebSocket-based chat function
  const chat = useCallback((text, language = 'en-IN') => {
    const trimmed = (text || "").trim();
    if (!trimmed) return Promise.resolve([]);
    
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return Promise.resolve([]);
    }

    // Add user message to chat history immediately
    setChatHistory(prev => [...prev, { role: 'user', text: trimmed }]);

    setLoading(true);
    stopAudioPlayback();

    return new Promise((resolve) => {
      try {
        const message = {
          type: 'chat_with_audio',
          message: trimmed,
          language: language,
          request_id: `chat_${Date.now()}`
        };

        const messageString = JSON.stringify(message);
        console.log('📤 Sending WebSocket Message:');
        console.log('Message Object:', message);
        console.log('JSON String:', messageString);
        console.log('-----------------------------------');
        wsRef.current.send(messageString);
        
        // Store resolve function to call when response is received
        currentMessageDataRef.current = {
          ...currentMessageDataRef.current,
          resolve: resolve,
          userMessage: trimmed
        };
        
      } catch (err) {
        console.error('WebSocket send error:', err);
        setLoading(false);
        resolve([]);
      }
    });
  }, [isConnected]);

  // Voice transcription function
  const transcribeAudio = useCallback((audioBlob, language = 'en-IN') => {
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function() {
        const base64Audio = reader.result.split(',')[1];
        
        const message = {
          type: 'transcribe_audio',
          audio_data: base64Audio,
          language: language,
          request_id: `voice_${Date.now()}`
        };

        const messageString = JSON.stringify(message);
        console.log('📤 Sending Voice Transcription Request:');
        console.log('Message Object:', message);
        console.log('JSON String:', messageString);
        console.log('-----------------------------------');
        wsRef.current.send(messageString);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }, [isConnected]);

  // Clear audio chunks function
  const clearAudioChunks = useCallback(() => {
    setAudioChunks([]);
    audioQueueRef.current = [];
    currentMessageDataRef.current = null;
  }, []);

  const onMessagePlayed = useCallback(() => {
    setMessages((messages) => {
      const currentMessage = messages[0];
      
      // For chunk-based messages, just remove from queue
      // Chat history is already handled when last chunk is received
      if (currentMessage && currentMessage.isChunk) {
        console.log('🎵 Audio chunk played, removing from queue');
        return messages.slice(1);
      }
      
      // For legacy complete messages, handle chat history
      if (currentMessage && currentMessage.messageText) {
        // Check if this message is already in chat history to prevent duplicates
        setChatHistory(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.text === currentMessage.messageText) {
            console.log('🔄 Message already in chat history, skipping duplicate');
            return prev;
          }
          return [...prev, { role: 'assistant', text: currentMessage.messageText }];
        });
        
        // Resolve the promise if it exists
        if (currentMessage.resolve) {
          currentMessage.resolve([currentMessage.messageText]);
        }
      }
      
      return messages.slice(1);
    });
    setLoading(false);
  }, []);

  // Initialize WebSocket connection on mount
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  // Update message state when messages change
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
        // Original values
        chat,
        messages,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        
        // WebSocket values
        isConnected,
        connectionStatus,
        audioChunks,
        clearAudioChunks,
        connectWebSocket,
        disconnectWebSocket,
        transcribeAudio,
        stopAudioPlayback,
        
        // Language configuration
        supportedLanguages: SUPPORTED_LANGUAGES,
        
        // Chat history for Experience component
        chatHistory,
        setChatHistory,
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

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface StickyVideoPlayerProps {
  vimeoId: string;
  title?: string;
}

export function StickyVideoPlayer({ vimeoId, title = "Module 1A: Introduction to AI & Machine Learning" }: StickyVideoPlayerProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Load Vimeo Player API and create iframe
  useEffect(() => {
    // Helper function to load Vimeo API
    const loadVimeoAPI = async (): Promise<void> => {
      return new Promise((resolve) => {
        if ((window as any).Vimeo) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };
    
    // Create the iframe and player
    const setupPlayer = async () => {
      await loadVimeoAPI();
      
      // Create a unique id for this iframe
      const iframeId = `vimeo-player-${vimeoId}`;
      
      // Create iframe if it doesn't exist
      let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=0&autopause=0&controls=0&title=0&byline=0&portrait=0`;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('title', title);
        
        // Append to DOM
        const container = document.getElementById('vimeo-container');
        if (container) {
          container.innerHTML = '';
          container.appendChild(iframe);
          
          // Initialize player
          const vimeoPlayer = new (window as any).Vimeo.Player(iframe);
          setPlayer(vimeoPlayer);
        }
      }
    };
    
    setupPlayer();
    
    // Cleanup function
    return () => {
      if (player) {
        player.unload();
      }
    };
  }, [vimeoId, title]);
  
  // Set up intersection observer to detect scroll
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSticky(!entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
    );
    
    observerRef.current.observe(container);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Toggle mute/unmute
  const toggleMute = () => {
    if (!player) return;
    
    if (isMuted) {
      player.setVolume(1);
      player.setMuted(false);
    } else {
      player.setVolume(0);
      player.setMuted(true);
    }
    
    setIsMuted(!isMuted);
  };
  
  return (
    <>
      {/* Main video container */}
      <div ref={videoContainerRef} className="w-full">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Video container that will hold our iframe */}
          <div id="vimeo-container" className="absolute inset-0"></div>
          
          {/* Unmute button for regular view */}
          {!isSticky && (
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sticky container - this is just a shell, we don't duplicate the iframe */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '320px',
          zIndex: 40,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'transparent',
          border: '2px solid rgba(249, 115, 22, 0.5)',
          transition: 'all 0.3s ease',
          opacity: isSticky ? 1 : 0,
          transform: isSticky ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: isSticky ? 'auto' : 'none',
        }}
      >
        <div className="relative aspect-video bg-black overflow-hidden">
          {/* When sticky, we position the iframe with fixed positioning via CSS */}
          {isSticky && (
            <style dangerouslySetInnerHTML={{ __html: `
              #vimeo-container iframe {
                position: fixed !important;
                top: auto !important;
                border-radius: 8px 8px 0 0 !important;
                left: auto !important;
                width: 318px !important;
                height: 180px !important;
                bottom: 56px !important;
                right: 25px !important;
                z-index: 49 !important;
              }
              @media (max-width: 639px) {
                #vimeo-container iframe {
                  width: 240px !important;
                  height: 135px !important;
                  bottom: 16px !important;
                  right: 16px !important;
                }
              }
            `}} />
          )}
          
          {/* Unmute button for sticky mode */}
          <button
            onClick={toggleMute}
            className="absolute bottom-2 right-2 z-[49] bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {/* Title bar */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2">
          <p className="text-white text-xs font-medium truncate">{title}</p>
        </div>
      </div>
    </>
  );
}

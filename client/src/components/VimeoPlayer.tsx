import { useEffect, useRef } from "react";

interface VimeoPlayerProps {
  videoId: string;
  onEnded?: () => void;
  className?: string;
}

export function VimeoPlayer({ videoId, onEnded, className = "" }: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Don't render if no valid video ID
  const isValidId = videoId && !videoId.includes("YOUR_VIMEO_ID") && videoId.length > 0;

  useEffect(() => {
    if (!isValidId) return;
    if (!iframeRef.current || !onEnded) return;

    // Listen for messages from Vimeo iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "ended") {
          onEnded();
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage);

    // Enable the Vimeo API
    if (iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ method: "addEventListener", value: "ended" }),
        "https://player.vimeo.com"
      );
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [videoId, onEnded, isValidId]);

  // Show placeholder if no valid video ID
  if (!isValidId) {
    return (
      <div className={`relative w-full ${className}`} style={{ paddingBottom: "56.25%" }}>
        <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Video Coming Soon</p>
            <p className="text-sm">This lesson's video is being prepared</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: "56.25%" }}>
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&vimeo_logo=0`}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="Vimeo video player"
      />
    </div>
  );
}

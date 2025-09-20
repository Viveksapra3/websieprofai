import { useState, useEffect } from 'react';

interface UseTypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  repeat?: boolean;
}

export const useTypingAnimation = ({
  text,
  speed = 100,
  delay = 1000,
  repeat = true
}: UseTypingAnimationProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!repeat && currentIndex === text.length && !isDeleting) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && currentIndex < text.length) {
        // Typing forward
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else if (!isDeleting && currentIndex === text.length) {
        // Pause before deleting
        setTimeout(() => {
          if (repeat) {
            setIsDeleting(true);
          }
        }, delay);
      } else if (isDeleting && currentIndex > 0) {
        // Deleting backward
        setDisplayText(text.slice(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      } else if (isDeleting && currentIndex === 0) {
        // Start typing again
        setIsDeleting(false);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, delay, repeat]);

  return {
    displayText,
    cursor: showCursor ? '_' : ' '
  };
};

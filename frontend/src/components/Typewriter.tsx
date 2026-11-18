"use client";

import { useState, useEffect } from "react";

export default function Typewriter({ 
  text, 
  speed = 30, 
  className = "" 
}: { 
  text: string; 
  speed?: number; 
  className?: string;
}) {
  // Start with an empty string, we will append to it in the interval
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    
    // Clear the text immediately when the component mounts
    setDisplayedText("");
    setIsDone(false);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        // Append the current character to the string
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {/* Blinking Cursor */}
      <span 
        className={`inline-block w-[2px] h-[1em] bg-gray-400 ml-1 align-middle ${
          isDone ? "animate-pulse" : "animate-[ping_1s_infinite]"
        }`}
        style={{ animationDuration: isDone ? '2s' : '0.8s' }}
      />
    </span>
  );
}
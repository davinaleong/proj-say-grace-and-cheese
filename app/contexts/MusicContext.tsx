'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  drift: number;
}

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

const confettiEmojis = ['🕊️', '🧀', '💖', '🌸'];

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(true);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const requestRef = useRef<number | undefined>(undefined);

  // Initialize confetti
  useEffect(() => {
    const initializeConfetti = () => {
      const newConfetti = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: Math.random() * (typeof window !== 'undefined' ? -window.innerHeight : -800),
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 1.5, // side-to-side
      }));
      setConfetti(newConfetti);
    };

    if (typeof window !== 'undefined') {
      initializeConfetti();
    }
  }, []);

  // Confetti animation
  useEffect(() => {
    if (!showConfetti) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      return;
    }

    const animate = () => {
      setConfetti(prev =>
        prev.map(item => {
          let newY = item.y + item.speed;
          let newX = item.x + item.drift;
          const newRotation = item.rotation + 2;

          // reset when it falls out of view
          if (typeof window !== 'undefined' && newY > window.innerHeight + 50) {
            newY = -20;
            newX = Math.random() * window.innerWidth;
          }

          return { ...item, x: newX, y: newY, rotation: newRotation };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [showConfetti]);

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Audio event listeners to sync state with actual playback
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    const initializeAudio = async () => {
      audio.volume = volume;
      
      try {
        // Try to play the audio
        await audio.play();
        setUserInteracted(true);
      } catch {
        // If auto-play fails (browser restriction), set playing to false
        console.log('Auto-play blocked by browser, user interaction required');
        setIsPlaying(false);
      }
    };

    // Global click handler to start music on first interaction
    const handleFirstInteraction = async (event: Event) => {
      // Don't auto-start if clicking on the music button or in a form
      if (event.target && (event.target as Element).closest('button, input, textarea, select')) {
        return;
      }
      
      if (!userInteracted && audio && audio.paused) {
        try {
          await audio.play();
          setUserInteracted(true);
          // Remove listeners after first successful interaction
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
        } catch {
          console.log('Failed to start music on user interaction');
        }
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    // Small delay to ensure the audio element is mounted
    const timer = setTimeout(initializeAudio, 100);
    
    return () => {
      clearTimeout(timer);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [volume, userInteracted]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Mark that user has interacted (so global handlers stop)
    setUserInteracted(true);
    
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.log('Failed to toggle audio:', error);
    }
  };

  const toggleConfetti = () => {
    setShowConfetti(prev => !prev);
  };

  const contextValue: MusicContextType = {
    isPlaying,
    toggleMusic,
    volume,
    setVolume,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {/* Confetti Layer */}
      {showConfetti && confetti.map(item => (
        <div
          key={item.id}
          style={{
            position: 'fixed',
            transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
            fontSize: '32px',
            zIndex: 1000,
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
            transition: 'transform 0.1s linear',
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      {/* Persistent audio element */}
      <audio 
        ref={audioRef}
        src="/assets/music/bg_edited.mp3"
        loop
        preload="auto"
        autoPlay
        playsInline
        controls={false}
        style={{ display: 'none' }}
      />
      {children}
    </MusicContext.Provider>
  );
};
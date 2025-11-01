'use client';

import Link from 'next/link';
import { Home, Play, Pause } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Title from '../components/Title';

const photographers = ['Cindy', 'Davina', 'May Hwee', 'Vincent', 'Wendy', 'YY'];
const confettiEmojis = ['🕊️', '🧀', '💖', '🌸'];

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  drift: number;
}

export default function PhotographersPage() {
  // Initialize confetti with a function to avoid re-running on every render
  const [confetti, setConfetti] = useState<ConfettiPiece[]>(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? -window.innerHeight : -800),
      rotation: Math.random() * 360,
      speed: 1 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 1.5, // side-to-side
    }))
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play music on component mount
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
      audio.volume = 0.3; // Set volume to 30%
      
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
      // Don't auto-start if clicking on the music button
      if (event.target && (event.target as Element).closest('button')) {
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
  }, [userInteracted]);

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

  useEffect(() => {
    const animate = () => {
      setConfetti(prev =>
        prev.map(item => {
          let newY = item.y + item.speed;
          let newX = item.x + item.drift;
          const newRotation = item.rotation + 2;

          // reset when it falls out of view
          if (newY > window.innerHeight + 50) {
            newY = -20;
            newX = Math.random() * window.innerWidth;
          }

          return { ...item, x: newX, y: newY, rotation: newRotation };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <>
      {/* Background Music */}
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

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        style={{
          position: 'fixed',
          bottom: '2em',
          right: '2em',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1c1c4a',
          color: 'white',
          border: '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2em',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(28, 28, 74, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2d2d5a';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(28, 28, 74, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1c1c4a';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 28, 74, 0.3)';
        }}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Confetti Layer */}
      {confetti.map(item => (
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

      {/* Main content */}
      <div
        style={{
          backgroundColor: '#ffdbdc',
          minHeight: '100vh',
          padding: '1em',
          fontFamily: 'Montserrat, sans-serif',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Title />
        <p>Select a photographer to view their gallery:</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2em',
            padding: '2em 0',
          }}
        >
          {photographers.map(photographer => (
            <Link
              key={photographer}
              href={`/photographer/${photographer.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ fontSize: '6em', marginBottom: '0.5em', position: 'relative' }}>
                🧀
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.3em',
                    fontWeight: 'bold',
                    color: '#1c1c4a',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  {photographer}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2em',
            padding: '0.5em 1em',
            backgroundColor: '#1c1c4a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.2em',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            border: '2px solid transparent',
            marginTop: '2em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#2d2d5a';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 28, 74, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#1c1c4a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Home size={18} />
          Home
        </Link>
      </div>
    </>
  );
}

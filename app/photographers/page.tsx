'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const newConfetti = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      rotation: Math.random() * 360,
      speed: 1 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 1.5, // side-to-side
    }));
    setConfetti(newConfetti);

    const animate = () => {
      setConfetti(prev =>
        prev.map(item => {
          let newY = item.y + item.speed;
          let newX = item.x + item.drift;
          let newRotation = item.rotation + 2;

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
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </div>
    </>
  );
}

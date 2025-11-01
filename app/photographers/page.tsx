'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { mapPhotographerToAsset } from '../utils/photographer-mapper';
import Title from '../components/Title';
import { useEffect, useState } from 'react';

// List of photographers - this could come from a database or config file
const photographers = [
  'Cindy',
  'Davina',
  'May Hwee',
  'Vincent',
  'Wendy',
  'YY'
];

const confettiEmojis = ['🕊️', '🧀', '💖', '🌸'];

export default function PhotographersPage() {
  const [confetti, setConfetti] = useState<Array<{
    id: number, 
    emoji: string, 
    x: number, 
    y: number, 
    rotation: number,
    speed: number
  }>>([]);

  useEffect(() => {
    const generateConfetti = () => {
      const newConfetti = [];
      for (let i = 0; i < 15; i++) {
        newConfetti.push({
          id: i,
          emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
          x: Math.random() * 100,
          y: -50,
          rotation: Math.random() * 360,
          speed: 2 + Math.random() * 3
        });
      }
      setConfetti(newConfetti);
      console.log('Generated confetti:', newConfetti);
    };

    generateConfetti();
    
    // Animate confetti falling
    const animateConfetti = () => {
      setConfetti(prev => prev.map(item => ({
        ...item,
        y: item.y + item.speed,
        rotation: item.rotation + 1
      })).filter(item => item.y < window.innerHeight + 50));
    };

    const interval = setInterval(animateConfetti, 50);
    return () => clearInterval(interval);
  }, []);

  console.log('Confetti state:', confetti); // Debug log

  return (
    <>
      {/* Confetti emojis with proper positioning */}
      {confetti.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'fixed',
            left: `${item.x}%`,
            top: `${item.y}px`,
            fontSize: '32px',
            zIndex: 1000,
            transform: `rotate(${item.rotation}deg)`,
            transition: 'top 0.1s linear',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {item.emoji}
        </div>
      ))}

      <div
        style={{
          backgroundColor: '#ffdbdc',
          minHeight: '100vh',
          padding: '1em',
          fontFamily: 'Montserrat, sans-serif',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Debug info */}
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'white', 
          padding: '10px', 
          zIndex: 10000,
          border: '1px solid black'
        }}>
          Confetti count: {confetti.length}
        </div>

      <Title />
      <p style={{ textAlign: 'center', margin: '1em 0' }}>Select a photographer to view their gallery:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2em', 
        padding: '2em 0' 
      }}>
        {photographers.map((photographer) => (
          <Link 
            key={photographer}
            href={`/photographer/${photographer.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ 
              position: 'relative', 
              display: 'inline-block',
              fontSize: '6em',
              marginBottom: '0.5em'
            }}>
              🧀
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '0.3em',
                fontWeight: 'bold',
                color: '#1c1c4a',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}>
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
          marginTop: '2em'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2d2d5a';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 28, 74, 0.3)';
        }}
        onMouseLeave={(e) => {
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
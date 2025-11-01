'use client';

import { Play, Pause } from 'lucide-react';
import { useMusicContext } from '../contexts/MusicContext';

interface MusicControlProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MusicControl({ className, style }: MusicControlProps) {
  const { isPlaying, toggleMusic } = useMusicContext();

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
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
    boxShadow: '0 4px 12px rgba(28, 28, 74, 0.3)',
    bottom: '2em',
    right: '2em',
    ...style
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEntering: boolean) => {
    const button = e.currentTarget;
    if (isEntering) {
      button.style.backgroundColor = '#2d2d5a';
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(28, 28, 74, 0.4)';
    } else {
      button.style.backgroundColor = '#1c1c4a';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(28, 28, 74, 0.3)';
    }
  };

  return (
    <button
        onClick={toggleMusic}
        className={className}
        style={buttonStyle}
        onMouseEnter={(e) => handleButtonHover(e, true)}
        onMouseLeave={(e) => handleButtonHover(e, false)}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
  );
}
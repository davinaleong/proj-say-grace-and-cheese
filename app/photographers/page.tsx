'use client';

import Link from 'next/link';
import Title from '../components/Title';
import { MusicProvider } from '../contexts/MusicContext';
import MusicControl from '../components/MusicControl';

const photographers = ['Cindy', 'Davina', 'May Hwee', 'Vincent', 'Wendy', 'YY'];

export default function PhotographersPage() {
  return (
    <MusicProvider>
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
      </div>
      
      {/* Music Control */}
      <MusicControl />
    </MusicProvider>
  );
}

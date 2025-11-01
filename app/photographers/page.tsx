'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { mapPhotographerToAsset } from '../utils/photographer-mapper';
import Title from '../components/Title';

// List of photographers - this could come from a database or config file
const photographers = [
  'Cindy',
  'Davina',
  'May Hwee',
  'Vincent',
  'Wendy',
  'YY'
];

export default function PhotographersPage() {
  return (
    <div
      style={{
        backgroundColor: '#ffdbdc',
        minHeight: '100vh',
        padding: '1em',
        fontFamily: 'Montserrat, sans-serif'
      }}
    >
      <Title />
      <p>Select a photographer to view their gallery:</p>
      
      <ul>
        {photographers.map((photographer) => (
          <li key={photographer}>
            <Link href={`/photographer/${photographer.toLowerCase().replace(/\s+/g, '-')}`}>
              {photographer}
            </Link>
            <p>Asset path: {mapPhotographerToAsset(photographer)}</p>
          </li>
        ))}
      </ul>
      
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
  );
}
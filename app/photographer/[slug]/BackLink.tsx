'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link 
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5em',
        padding: '0.8em 1.5em',
        backgroundColor: '#1c1c4a',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '25px',
        fontSize: '1.1em',
        fontWeight: '500',
        transition: 'all 0.3s ease',
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
      <ArrowLeft size={20} />
      {children}
    </Link>
  );
}
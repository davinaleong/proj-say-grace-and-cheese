'use client';

import { ReactNode } from 'react';
import { MusicProvider } from '../../contexts/MusicContext';
import MusicControl from '../../components/MusicControl';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <MusicProvider>
      {children}
      <MusicControl />
    </MusicProvider>
  );
}
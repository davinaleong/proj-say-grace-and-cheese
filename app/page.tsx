'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Title from './components/Title';

export default function HomePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-passphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: password })
      });

      if (response.ok) {
        router.push('/photographers');
      } else {
        const data = await response.json();
        setError(data.error || 'Incorrect password');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#ffdbdc',
      padding: '0.5em'
    }}>
      <div style={{
        minWidth: '30ch',
        textAlign: 'center'
      }}>
        <Title />
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Private Photography Gallery
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5em',
                border: '1px solid #d1d5db',
                borderRadius: '0.2em',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !password.trim()}
            style={{
              width: '100%',
              padding: '0.5em',
              backgroundColor: loading || !password.trim() ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.2em',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Checking...' : 'Enter Gallery'}
          </button>
          
          {error && (
            <p style={{ 
              color: '#dc2626', 
              marginTop: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </p>
          )}
        </form>
        
        <p style={{ 
          marginTop: '2rem', 
          fontSize: '0.75rem', 
          color: '#9ca3af' 
        }}>
          Access restricted to invited guests only
        </p>
      </div>
    </div>
  );
}

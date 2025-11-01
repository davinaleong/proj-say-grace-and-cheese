'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PassphrasePage() {
  const [passphrase, setPassphrase] = useState('');
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
        body: JSON.stringify({ passphrase })
      });

      if (response.ok) {
        router.push('/photographers');
      } else {
        setError('Invalid passphrase');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Say Grace and Cheese</h1>
      <h2>Enter Passphrase</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="passphrase">Passphrase:</label>
          <input
            id="passphrase"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Enter'}
        </button>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

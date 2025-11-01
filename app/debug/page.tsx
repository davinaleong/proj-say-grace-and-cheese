'use client';

import { useState } from 'react';

interface DebugResult {
  success?: boolean;
  error?: string;
  debug?: {
    passphrase: string;
    storedHash: string;
    storedHashValid: boolean;
    freshHash: string;
    freshHashValid: boolean;
    storedHashFormat?: {
      algorithm: string;
      saltRounds: string;
      length: number;
    };
  };
}

export default function DebugPage() {
  const [passphrase, setPassphrase] = useState('');
  const [result, setResult] = useState<DebugResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testHash = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase })
      });
      
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: 'Failed to test hash' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Hash Debug Tool</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Test Passphrase:
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
          />
        </label>
        <button 
          onClick={testHash} 
          disabled={loading || !passphrase}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          {loading ? 'Testing...' : 'Test Hash'}
        </button>
      </div>

      {result && (
        <div>
          <h2>Results:</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.debug && (
            <div style={{ marginTop: '20px' }}>
              <h3>Summary:</h3>
              <p>
                <strong>Stored Hash Valid:</strong> {' '}
                <span style={{ color: result.debug.storedHashValid ? 'green' : 'red' }}>
                  {result.debug.storedHashValid ? '✅ YES' : '❌ NO'}
                </span>
              </p>
              <p>
                <strong>Fresh Hash Valid:</strong> {' '}
                <span style={{ color: result.debug.freshHashValid ? 'green' : 'red' }}>
                  {result.debug.freshHashValid ? '✅ YES' : '❌ NO'}
                </span>
              </p>
              <p><strong>Algorithm:</strong> {result.debug.storedHashFormat?.algorithm}</p>
              <p><strong>Salt Rounds:</strong> {result.debug.storedHashFormat?.saltRounds}</p>
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Enter the passphrase you think should work</li>
          <li>Click &quot;Test Hash&quot; to see if it matches your stored hash</li>
          <li>The tool will also generate a fresh hash for comparison</li>
          <li>If the stored hash doesn&apos;t work, you may need to regenerate it</li>
        </ol>
      </div>
    </div>
  );
}
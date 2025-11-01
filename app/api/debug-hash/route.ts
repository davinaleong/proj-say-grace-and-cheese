import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();
    
    const storedHash = process.env.PASSWORD_HASH;
    
    if (!storedHash) {
      return NextResponse.json({ 
        error: 'No PASSWORD_HASH found in environment',
        debug: {
          env: process.env.NODE_ENV,
          hasEnvVar: !!process.env.PASSWORD_HASH
        }
      }, { status: 500 });
    }

    // Test comparison
    const isValid = await bcrypt.compare(passphrase, storedHash);
    
    // Generate a fresh hash for the same passphrase to compare
    const freshHash = await bcrypt.hash(passphrase, 12);
    const freshVerification = await bcrypt.compare(passphrase, freshHash);
    
    return NextResponse.json({
      success: true,
      debug: {
        passphrase: passphrase,
        storedHash: storedHash,
        storedHashValid: isValid,
        freshHash: freshHash,
        freshHashValid: freshVerification,
        storedHashFormat: {
          algorithm: storedHash.substring(0, 4),
          saltRounds: storedHash.split('$')[2],
          length: storedHash.length
        }
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();
    
    if (!passphrase) {
      return NextResponse.json({ error: 'Passphrase required' }, { status: 400 });
    }

    const hashedPassword = process.env.PASSWORD_HASH;
    
    if (!hashedPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const isValid = await bcrypt.compare(passphrase, hashedPassword);
    
    if (isValid) {
      const response = NextResponse.json({ success: true });
      // Set a session cookie
      response.cookies.set('authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid passphrase' }, { status: 401 });
    }
  } catch (error) {
    console.error('Passphrase verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
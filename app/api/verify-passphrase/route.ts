import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();
    
    if (!passphrase) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const correctPassword = process.env.SITE_PASSWORD;
    
    if (!correctPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Simple string comparison - password must match exactly
    const isValid = passphrase === correctPassword;
    
    if (isValid) {
      const response = NextResponse.json({ success: true });
      // Set a session cookie
      response.cookies.set('authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days for convenience
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
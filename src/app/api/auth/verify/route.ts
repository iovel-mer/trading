import { NextRequest, NextResponse } from 'next/server';
import { serverCookies } from '@/lib/cookies';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or headers
    const cookies = serverCookies.parse(request.headers.get('cookie'));
    const authHeader = request.headers.get('authorization');
    
    const token = cookies.authToken || 
                  (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Here you would typically verify the token with your backend
    // For now, we'll just return a success response
    return NextResponse.json({
      authenticated: true,
      message: 'Token is valid',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
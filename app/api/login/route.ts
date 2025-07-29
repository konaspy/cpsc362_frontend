import { NextRequest, NextResponse } from 'next/server';

// GET /api/login - Proxy to actual login API at localhost:80
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call the actual API at localhost:80
    const apiUrl = `http://localhost:80/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Return the response from the actual API
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Login failed' },
        { status: response.status }
      );
    }

    // Forward successful response (should contain token and role)
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error calling login API:', error);
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to authentication server' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
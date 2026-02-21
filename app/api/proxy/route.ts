import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint') || '';
  
  // Remove trailing slash if present
  endpoint = endpoint.replace(/\/$/, '');
  
  // Remove endpoint param and get the rest
  searchParams.delete('endpoint');
  const queryParams = searchParams.toString();
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}${queryParams ? '?' + queryParams : ''}`;
  
  console.log('Proxy GET:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Response is not JSON (likely HTML error page)
      const text = await response.text();
      
      // Check for specific error types
      let errorMessage = 'Backend returned non-JSON response';
      let statusCode = 502;
      
      if (text.includes('Database Error')) {
        errorMessage = 'The backend database is currently unavailable. Please try again later.';
        statusCode = 503;
        console.error('🔴 Database Error from backend - Server issue');
      } else if (text.includes('404')) {
        errorMessage = 'API endpoint not found';
        statusCode = 404;
      } else if (response.status === 500) {
        errorMessage = 'Backend server error';
        statusCode = 500;
      }
      
      console.error('Non-JSON response:', errorMessage);
      console.error('Response preview:', text.substring(0, 200));
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorMessage,
          code: statusCode,
        },
        { status: statusCode }
      );
    }
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'API request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint') || '';
  
  // Remove trailing slash if present
  endpoint = endpoint.replace(/\/$/, '');
  
  searchParams.delete('endpoint');
  const queryParams = searchParams.toString();
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}${queryParams ? '?' + queryParams : ''}`;
  
  console.log('Proxy POST:', apiUrl);
  
  try {
    const body = await request.json();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      
      let errorMessage = 'Backend returned non-JSON response';
      let statusCode = 502;
      
      if (text.includes('Database Error')) {
        errorMessage = 'The backend database is currently unavailable. Please try again later.';
        statusCode = 503;
        console.error('🔴 Database Error from backend - Server issue');
      }
      
      console.error('Non-JSON response:', errorMessage);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorMessage,
          code: statusCode,
        },
        { status: statusCode }
      );
    }
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'API request failed' },
      { status: 500 }
    );
  }
}

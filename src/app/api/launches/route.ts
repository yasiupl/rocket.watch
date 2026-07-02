import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://ll.thespacedevs.com/2.0.0/';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    // Construct the external API URL
    // We pass the path directly and append any other search params
    const externalParams = new URLSearchParams(searchParams);
    externalParams.delete('path'); // Remove the routing path param

    const externalUrl = `${API_BASE_URL}${path}${externalParams.toString() ? '?' + externalParams.toString() : ''}`;

    const res = await fetch(externalUrl, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to Launch Library API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import sources from '@/sources.json';

export async function GET() {
  return NextResponse.json(sources);
}

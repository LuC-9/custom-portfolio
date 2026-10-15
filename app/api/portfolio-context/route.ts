import { NextResponse } from 'next/server';
import { getPortfolioContext } from '@/lib/portfolio-context';

export async function GET() {
  try {
    return NextResponse.json(await getPortfolioContext());
  } catch {
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 });
  }
}

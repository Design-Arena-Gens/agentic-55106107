import { NextResponse } from 'next/server';

import { runInstitutionalSweep } from '@/lib/agent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await runInstitutionalSweep();

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unexpected error while performing accumulation scan.';

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}

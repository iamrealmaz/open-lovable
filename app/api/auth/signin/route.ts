import { signIn } from '@/lib/supabase/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await signIn(email, password);

    return NextResponse.json({ success: true, user: result.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sign in failed' },
      { status: 400 }
    );
  }
}

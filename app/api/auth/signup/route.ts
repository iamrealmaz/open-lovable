import { signUp } from '@/lib/supabase/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await signUp(email, password, fullName);

    return NextResponse.json({ success: true, user: result.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sign up failed' },
      { status: 400 }
    );
  }
}

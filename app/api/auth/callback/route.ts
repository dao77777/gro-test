import { createClient } from '@/app/_lib/supabase/serverClient';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log("[api/auth/callback] request comming");
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  console.log(code);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
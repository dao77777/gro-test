
# Markdown <-> HTML

Installation: `pnpm add unified remark-parse remark-html`

# Ai SDK

Installation: `pnpm add ai @ai-sdk/react @ai-sdk/openai-compatible @ai-sdk/provider @ai-sdk/provider-utils zod`

# Supabase

Installation: `npm install @supabase/supabase-js @supabase/ssr`


## Table

## Auth

`signUp`, `signInWithPassword`, `verifyOtp`, `exchangeCodeForSession`

**RLS**

**Supabase Client**

Client for browser environment
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Client for nextjs server environment
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

Client for nextjs middleware
```typescript
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  // 刷新会话
  await supabase.auth.getSession();
  return res;
}

// 配置中间件匹配的路由
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/sign-up'], // 仅在需要 Supabase 的路由上运行
};
```

**Auth Action**

```typescript
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    return redirect('/error');
  }

  return redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    return redirect('/error');
  }

  return redirect('/dashboard');
}
```

## framer-motion

Installation: `npm install framer-motion`

## dnd-kit

`collision detect`

`sensor`: pointer, mouse, touch, keyboard
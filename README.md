# Setup

## Clone

克隆本项目到本地, `git clone https://github.com/dao77777/gro-test.git`

写一份`.env.local`, 你需要提供以下环境变量
- `NEXT_PUBLIC_SUPABASE_URL`: 创建supabase项目时提供的 `url`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 创建supabase项目时提供的 `anon_key`
- `DEEPSEEK_API_KEY`: 此项目使用的是deepseek的api, 请从deepseek官方获取 `api key`
```typescript
NEXT_PUBLIC_SUPABASE_URL="xxx"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
DEEPSEEK_API_KEY="xxx"
```

## Github OAuth

此项目的认证鉴权采用的是supabase自带的 `github oauth` 鉴权方式, 流程如下
1. 浏览器端向supabase发起oauth认证请求, supabase重定向到github
2. 在github这里获取oauth授权码, 并重定向到supabase提供的重定向url
3. supabase会再次重定向到nextjs的 `/api/auth/callback` 端点获取 `access token` 和 `refresh token` 并注入 `cookie` 中
4. 返回到 `/` 路径, 此时已在 `cookie` 中获取到了权限

此认证鉴权流程需要我们需要做两处配置
- github上申请 `oauth app`, 并以如下设置
  - `Homepage URL` 设置为 `http://localhost:3000`
  - `Authorization callback URL` 设置为supabase提供的重定向url, 下面会讲述如何获取
- supabase
  - 开启 `github oauth provider`, 并在此处拿到supabase提供的重定向url, 填入申请 `github oauth app` 时拿到的 `Client ID` 和 `Client Secret`
  - 设置supabase的 `URL Configuration` 中的 `Redirect URLs` 为 `http://localhost:3000/api/auth/callback`

## Start

运行命令启动项目, `pnpm dev`

# Tech Stack

此项目的主要技术栈为
- Frame: `nextjs`
- DB: `supabase`
- Query: `react query`
- AI: `ai sdk`, `deepseek`, `remark`
- Style: `shadcn/ui`, `tailwindcss`, `lucide`
- Drag: `framer motion`, `dnd-kit`

## Nextjs

不必多说

## React Query

构建项目的异步请求功能, 用它的三个理由
1. 其为请求的结果提供了缓存, 通过 `query key` 区分项目的所有请求, 避免不必要的网络开销
2. 为异步请求的所有状态做了同步, 当你做出异步请求时, 关于这个请求的所有状态直接拿来即用
3. 比较容易实现乐观更新

## Remark

Installation: `pnpm add unified remark-parse remark-html`

用于`html <-> mark`的相互转换, 此项目的作用是将 `markdown` 格式转换为 `html`

## Ai SDK

Installation: `pnpm add ai @ai-sdk/react @ai-sdk/openai-compatible @ai-sdk/provider @ai-sdk/provider-utils zod`

用于构建后端的ai层, 使能够调用大模型的能力

## Supabase

Installation: `npm install @supabase/supabase-js @supabase/ssr`

项目的数据库, 也内置了认证鉴权流程, 权限由 `RLS` 保障

`signUp`, `signInWithPassword`, `verifyOtp`, `exchangeCodeForSession`

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

  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/sign-up'],
};
```
## framer Motion & dnd-kit

Installation: `pnpm install framer-motion @dnd-kit/core`

拖拽的实现, 挺丝滑的

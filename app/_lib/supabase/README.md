# React Query + Supabase 集成

这个模块提供了使用 React Query 包装的 Supabase 客户端，提供了缓存、状态管理和自动重新获取等功能。

## 功能特性

- ✅ 自动缓存和状态管理
- ✅ 乐观更新
- ✅ 自动重新获取
- ✅ 错误处理
- ✅ 加载状态
- ✅ 类型安全
- ✅ 查询失效和重新验证

## 安装依赖

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## 设置 Provider

在 `app/layout.tsx` 中添加 ReactQueryProvider：

```tsx
import { ReactQueryProvider } from "./_lib/react-query/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

## 可用的 Hooks

### 用户认证

```tsx
import { useUser, useSupabaseSignIn, useSupabaseSignOut } from '../_lib/supabase/react-query-client'

// 获取当前用户
const { data: user, isLoading, error } = useUser()

// 登录
const signIn = useSupabaseSignIn()
await signIn.mutateAsync({ email: 'user@example.com', password: 'password' })

// 登出
const signOut = useSupabaseSignOut()
await signOut.mutateAsync()
```

### 数据查询

```tsx
import { useSupabaseQuery, useSupabaseQueryById } from '../_lib/supabase/react-query-client'

// 查询所有数据
const { data: todos, isLoading, error } = useSupabaseQuery<Todo>('todos')

// 带过滤器的查询
const { data: completedTodos } = useSupabaseQuery<Todo>('todos', {
  filters: { completed: true },
  orderBy: { column: 'created_at', ascending: false },
  limit: 10
})

// 根据 ID 查询单条数据
const { data: todo } = useSupabaseQueryById<Todo>('todos', 'todo-id')
```

### 数据操作

```tsx
import { useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '../_lib/supabase/react-query-client'

// 插入数据
const insertTodo = useSupabaseInsert<Partial<Todo>>('todos')
await insertTodo.mutateAsync({ title: '新任务', completed: false })

// 更新数据
const updateTodo = useSupabaseUpdate<Todo>('todos')
await updateTodo.mutateAsync({ 
  id: 'todo-id', 
  data: { completed: true } 
})

// 删除数据
const deleteTodo = useSupabaseDelete('todos')
await deleteTodo.mutateAsync('todo-id')
```

## 类型定义

```tsx
interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
}

// 插入时使用 Partial<T>，因为 id 和 created_at 会自动生成
const insertTodo = useSupabaseInsert<Partial<Todo>>('todos')

// 更新时使用完整的类型
const updateTodo = useSupabaseUpdate<Todo>('todos')
```

## 查询配置选项

```tsx
useSupabaseQuery<Todo>('todos', {
  select: 'id, title, completed', // 选择特定字段
  filters: { 
    completed: true,
    user_id: 'user-123'
  },
  orderBy: { 
    column: 'created_at', 
    ascending: false 
  },
  limit: 20
})
```

## 缓存管理

React Query 会自动管理缓存，但你也可以手动控制：

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { supabaseKeys } from '../_lib/supabase/react-query-client'

const queryClient = useQueryClient()

// 使特定查询失效
queryClient.invalidateQueries({ queryKey: supabaseKeys.data('todos') })

// 清除所有缓存
queryClient.clear()
```

## 错误处理

```tsx
const { data, error, isLoading } = useSupabaseQuery<Todo>('todos')

if (error) {
  console.error('查询失败:', error.message)
  return <div>加载失败: {error.message}</div>
}

if (isLoading) {
  return <div>加载中...</div>
}
```

## 最佳实践

1. **使用类型安全**: 为你的数据定义 TypeScript 接口
2. **合理使用 enabled**: 对于依赖其他数据的查询，使用 `enabled` 选项
3. **错误边界**: 在组件中处理错误状态
4. **加载状态**: 为用户提供加载反馈
5. **乐观更新**: 对于快速操作，考虑使用乐观更新

## 示例组件

查看 `app/_components/SupabaseExample.tsx` 获取完整的使用示例。 
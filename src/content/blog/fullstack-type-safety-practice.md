---
title: 全栈 TypeScript 类型共享的克制实践
description: 从中小型全栈项目的真实痛点出发，聊聊如何在前后端之间优雅共享契约类型，而又不把工程复杂度拉高。
pubDate: 2026-11-05
tags:
  - 全栈开发
  - TypeScript
  - 工程架构
---

全栈开发最常见的一类 Bug，并不是算法写错了，而是**后端改了一个字段名或可空性，前端直到上线后才发现**。TypeScript 让前后端使用同一种语言成为可能，但“类型共享”也容易被过度设计。

## 保持单一事实来源（Single Source of Truth）

相比分别在前端和后端手写两份几乎相同的 `interface`，更稳妥的做法是用 **Schema** 同时承担「运行时校验」与「静态类型推导」两件事。

```ts
import { z } from 'zod';

export const ProjectPayloadSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(80),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).max(6),
});

export type ProjectPayload = z.infer<typeof ProjectPayloadSchema>;
```

这样一来，后端路由入口用 `ProjectPayloadSchema.parse(body)` 拦住脏数据，前端直接复用 `ProjectPayload` 类型，既不重复维护，也不怕文档过期。

## 什么不该放进共享包

在 Monorepo 中设立一个轻量的 `packages/shared` 时，建议严格约束它的边界：

- **放进去的**：API 请求/响应 Schema、错误码枚举、纯函数格式化工具。
- **不要放进去的**：数据库 ORM 实例、浏览器 DOM 逻辑、带副作用的环境变量读取。

## 小结

好的工程实践往往很朴素：让正确的事变成最省力的事。只要把契约边界守住，中小型全栈团队完全可以用很轻的成本获得极高的迭代信心。

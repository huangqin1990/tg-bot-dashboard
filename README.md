# TG Bot Dashboard

全栈管理后台系统，用于管理 Telegram Bot 的数据录入。

## 技术栈

- **前端**: Vue 3 + TypeScript + Naive UI + Vite
- **后端**: Hono + TypeScript + Node.js
- **数据库**: Supabase (与 tg-bot 共享)

## 功能特性

- 分类管理（增删改查、排序、状态切换）
- 商户管理（完整 CRUD、批量操作、搜索筛选）
- 响应式设计，支持移动端
- 实时数据同步

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置（已配置好）

### 3. 启动开发服务器

```bash
pnpm dev
```

这将同时启动：
- 后端服务器: http://localhost:3001
- 前端开发服务器: http://localhost:5173

## 项目结构

```
src/
├── client/          # Vue 3 前端应用
│   ├── src/
│   │   ├── api/     # API 客户端
│   │   ├── pages/   # 页面组件
│   │   ├── layouts/ # 布局组件
│   │   └── router/  # 路由配置
├── server/          # Hono 后端服务
│   ├── routes/      # API 路由
│   ├── services/    # 业务逻辑层
│   └── utils/       # 工具函数
└── shared/          # 前后端共享类型
```

## API 端点

### 分类管理
- GET `/api/categories` - 获取所有分类
- GET `/api/categories/:id` - 获取单个分类
- POST `/api/categories` - 创建分类
- PATCH `/api/categories/:id` - 更新分类
- DELETE `/api/categories/:id` - 删除分类
- POST `/api/categories/reorder` - 更新排序

### 商户管理
- GET `/api/merchants` - 搜索商户（支持分页、筛选）
- GET `/api/merchants/:id` - 获取单个商户
- GET `/api/merchants/featured` - 获取推荐商户
- POST `/api/merchants` - 创建商户
- PATCH `/api/merchants/:id` - 更新商户
- DELETE `/api/merchants/:id` - 删除商户
- POST `/api/merchants/bulk/status` - 批量更新状态
- POST `/api/merchants/bulk/featured` - 批量更新推荐状态

## 开发脚本

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```
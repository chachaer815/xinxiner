# 部署说明

这个 CRM 不是纯静态网页。它用了 Next.js 服务端能力、Prisma 和数据库，所以部署时不能只当作普通 HTML 静态站点上传。

## 最常见的打不开原因

1. **部署根目录选错了**
   - 如果你部署的是整个旧仓库，平台可能找不到 `package.json`。
   - Root Directory / 项目根目录要设置成：`inquiry-crm`。

2. **没有配置数据库环境变量**
   - 必须配置 `DATABASE_URL`。
   - 本地演示可用 SQLite：`file:./dev.db`。
   - 生产部署建议用 PostgreSQL（Neon、Supabase、Railway、Render、VPS 自建都可以）。

3. **没有配置登录密钥**
   - 必须配置 `AUTH_SECRET`。
   - 建议使用 32 位以上随机字符串。

4. **数据库没有初始化**
   - 首次部署后需要执行：

```bash
npm run db:push
npm run db:seed
```

5. **部署平台不支持服务端运行**
   - GitHub Pages、普通静态空间、只支持静态文件的对象存储不能直接运行这个项目。
   - 可以使用 Vercel、Railway、Render、Fly.io、VPS + Docker 等支持 Node.js 服务端的平台。

## 推荐部署配置

### 如果用 Vercel / Netlify 这类平台

- Root Directory：`inquiry-crm`
- Install Command：`npm install`
- Build Command：`npm run build`
- Output：Next.js 默认输出，不要手动改成 `dist`
- 环境变量：
  - `DATABASE_URL`
  - `AUTH_SECRET`

> 注意：Serverless 平台不适合用 SQLite 文件数据库做生产数据，因为文件系统通常不可持久化。建议接 PostgreSQL。

### 如果用 Railway / Render

- Root Directory：`inquiry-crm`
- Build Command：`npm install && npm run build`
- Start Command：`npm run start`
- 环境变量：
  - `DATABASE_URL`
  - `AUTH_SECRET`

## 健康检查

部署后访问：

```text
/api/health
```

如果返回：

```json
{
  "app": "ok",
  "hasDatabaseUrl": true,
  "hasAuthSecret": true,
  "database": "ok"
}
```

说明服务端、环境变量和数据库连接基本正常。

如果 `hasDatabaseUrl` 或 `hasAuthSecret` 是 `false`，说明环境变量没配。

如果 `database` 不是 `ok`，说明数据库地址、网络权限或数据库初始化有问题。

## 部署后如何登录

初始化种子数据后，可以使用：

| 角色 | 邮箱 | 密码 |
| --- | --- | --- |
| IT 管理员 | admin@example.com | password123 |
| 老板 | boss@example.com | password123 |
| 业务员 | sales@example.com | password123 |

## 如果你只是想先看页面

部署后可以先访问：

```text
/setup
```

这个页面不依赖登录和数据库，用来确认 Next.js 页面本身是否能打开。

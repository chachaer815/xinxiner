# 业务员询盘跟进 CRM

一个独立的全栈 CRM 后台 MVP，用于替代简道云中的询盘跟进场景。项目采用 Next.js + Prisma + SQLite（可替换 PostgreSQL）实现，包含角色权限、询盘录入、跟进记录、下次跟进提醒、老板统计视图、IT 管理员配置与自定义字段/工作流能力。

## 角色能力

- **业务员**：登录、录入自己的询盘、填写跟进记录、设置下次跟进时间，仅可见自身询盘。
- **老板**：查看全公司询盘、首页统计、业务员跟进排行与逾期提醒。
- **IT 管理员**：开通/停用账号、全数据管理、系统配置、自定义询盘字段、配置工作流阶段。

## 当前项目在哪里？

本项目位于当前仓库的 `inquiry-crm/` 目录。它是一个独立的全栈项目目录，可以单独复制、单独初始化 Git、单独发布为新的 GitHub 仓库。

> 注意：代码目录已经独立，但 GitHub 远程仓库需要使用你的 GitHub 账号授权后才能创建。具体发布步骤见 [GITHUB_REPO_GUIDE.md](./GITHUB_REPO_GUIDE.md)。

## 快速开始

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

默认账号：

| 角色 | 邮箱 | 密码 |
| --- | --- | --- |
| IT 管理员 | admin@example.com | password123 |
| 老板 | boss@example.com | password123 |
| 业务员 | sales@example.com | password123 |

## 常用命令

```bash
npm run typecheck
npm run build
npm run db:studio
```

## 后续可扩展方向

- 将 `DATABASE_URL` 切换到 PostgreSQL（Neon、Supabase、Railway 或自建）。
- 接入企业微信/钉钉登录和消息提醒。
- 增加字段级权限、审批流、批量导入导出、操作日志审计。
- 增加可视化流程设计器与自动化任务（例如逾期自动提醒）。

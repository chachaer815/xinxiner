import Link from "next/link";
import { Role } from "@prisma/client";
import { logoutAction } from "@/app/actions";
import { SessionUser } from "@/lib/auth";
import { roleLabel } from "@/lib/format";

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const isAdmin = user.role === Role.ADMIN;
  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="logo">询盘 CRM</div>
        <div className="muted" style={{ marginBottom: 16 }}>{user.name} · {roleLabel(user.role)}</div>
        <nav className="nav">
          <Link href="/dashboard">首页数据</Link>
          <Link href="/inquiries/new">录入询盘</Link>
          {isAdmin && <Link href="/admin/users">账号管理</Link>}
          {isAdmin && <Link href="/admin/fields">自定义字段</Link>}
          {isAdmin && <Link href="/admin/workflows">工作流配置</Link>}
          {isAdmin && <Link href="/admin/settings">系统配置</Link>}
          <form action={logoutAction}><button className="logout-button">退出登录</button></form>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

import { saveUserAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { roleLabel } from "@/lib/format";

export default async function UsersPage() {
  const user = await requireRole(["ADMIN"]);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>账号管理</h1><p className="muted">IT 管理员可开通、停用账号并分配角色。</p></div></div>
      <section className="grid grid-2">
        <form className="card form" action={saveUserAction}>
          <h2>新增账号</h2>
          <label>姓名<input name="name" required /></label><label>邮箱<input name="email" type="email" required /></label>
          <div className="form-row"><label>角色<select name="role"><option value="SALES">业务员</option><option value="BOSS">老板</option><option value="ADMIN">IT 管理员</option></select></label><label>状态<select name="status"><option value="ACTIVE">启用</option><option value="DISABLED">停用</option></select></label></div>
          <div className="form-row"><label>手机<input name="phone" /></label><label>部门<input name="department" /></label></div>
          <label>初始密码<input name="password" type="password" placeholder="默认 password123" /></label><button className="btn">保存账号</button>
        </form>
        <div className="card"><h2>账号列表</h2><div className="table-wrap"><table><thead><tr><th>姓名</th><th>邮箱</th><th>角色</th><th>状态</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td>{roleLabel(item.role)}</td><td><span className={item.status === "ACTIVE" ? "badge ok" : "badge danger"}>{item.status === "ACTIVE" ? "启用" : "停用"}</span></td></tr>)}</tbody></table></div></div>
      </section>
    </AppShell>
  );
}

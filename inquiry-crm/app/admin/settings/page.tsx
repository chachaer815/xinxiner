import { saveSettingAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const user = await requireRole(["ADMIN"]);
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: "asc" } });
  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>系统配置</h1><p className="muted">配置全局规则，例如逾期阈值、提醒策略等。</p></div></div>
      <section className="grid grid-2"><form className="card form" action={saveSettingAction}><h2>新增/更新配置</h2><label>配置 key<input name="key" required placeholder="overdue_hours" /></label><label>配置值<input name="value" required /></label><label>说明<textarea name="description" /></label><button className="btn">保存配置</button></form><div className="card"><h2>配置列表</h2><div className="table-wrap"><table><thead><tr><th>Key</th><th>值</th><th>说明</th></tr></thead><tbody>{settings.map((s) => <tr key={s.id}><td>{s.key}</td><td>{s.value}</td><td>{s.description}</td></tr>)}</tbody></table></div></div></section>
    </AppShell>
  );
}

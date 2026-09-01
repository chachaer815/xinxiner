import { saveWorkflowStageAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { statusLabel } from "@/lib/format";

export default async function WorkflowsPage() {
  const user = await requireRole(["ADMIN"]);
  const stages = await prisma.workflowStage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>工作流配置</h1><p className="muted">配置询盘阶段，后续可扩展审批、自动提醒和条件流转。</p></div></div>
      <section className="grid grid-2"><form className="card form" action={saveWorkflowStageAction}><h2>新增阶段</h2><label>阶段名称<input name="name" required /></label><div className="form-row"><label>绑定状态<select name="status"><option value="NEW">新询盘</option><option value="FOLLOWING">跟进中</option><option value="QUOTED">已报价</option><option value="WON">成交</option><option value="LOST">丢单</option><option value="ARCHIVED">归档</option></select></label><label>排序<input name="sortOrder" type="number" defaultValue="0" /></label></div><label>说明<textarea name="description" /></label><button className="btn">保存阶段</button></form><div className="card"><h2>阶段列表</h2><div className="table-wrap"><table><thead><tr><th>阶段</th><th>状态</th><th>说明</th></tr></thead><tbody>{stages.map((s) => <tr key={s.id}><td>{s.name}</td><td>{statusLabel(s.status)}</td><td>{s.description}</td></tr>)}</tbody></table></div></div></section>
    </AppShell>
  );
}

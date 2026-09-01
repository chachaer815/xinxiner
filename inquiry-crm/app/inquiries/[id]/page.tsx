import { redirect } from "next/navigation";
import { addFollowUpAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { canSeeAllData, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime, formatMoney, statusLabel } from "@/lib/format";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { owner: true, followUps: { include: { user: true }, orderBy: { createdAt: "desc" } }, customValues: { include: { field: true } } }
  });
  if (!inquiry || (!canSeeAllData(user.role) && inquiry.ownerId !== user.id)) redirect("/dashboard");
  const stages = await prisma.workflowStage.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } });
  const addFollowUp = addFollowUpAction.bind(null, inquiry.id);

  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>{inquiry.title}</h1><p className="muted">{inquiry.customerName} · {inquiry.customerCompany ?? "未填写公司"}</p></div><span className="badge">{statusLabel(inquiry.status)}</span></div>
      <section className="grid grid-2">
        <div className="card">
          <h2>询盘信息</h2>
          <p>负责人：{inquiry.owner.name}</p><p>电话：{inquiry.contactPhone ?? "-"}</p><p>邮箱：{inquiry.contactEmail ?? "-"}</p>
          <p>来源：{inquiry.source ?? "-"}</p><p>意向产品：{inquiry.productInterest ?? "-"}</p><p>预计金额：{formatMoney(inquiry.estimatedAmount)}</p>
          <p>下次跟进：{formatDateTime(inquiry.nextFollowUpAt)}</p>
          {inquiry.customValues.length > 0 && <><h3>自定义字段</h3>{inquiry.customValues.map((item) => <p key={item.id}>{item.field.label}：{item.value}</p>)}</>}
        </div>
        <form className="card form" action={addFollowUp}>
          <h2>新增跟进记录</h2>
          <label>跟进方式<select name="method"><option>电话</option><option>微信</option><option>邮件</option><option>面谈</option><option>其他</option></select></label>
          <label>阶段<select name="status" defaultValue={inquiry.status}>{stages.map((s) => <option key={s.id} value={s.status}>{s.name}</option>)}</select></label>
          <label>跟进内容<textarea name="content" required /></label>
          <label>下次跟进时间<input name="nextFollowUpAt" type="datetime-local" /></label>
          <button className="btn">提交跟进</button>
        </form>
      </section>
      <div className="card" style={{ marginTop: 18 }}>
        <h2>跟进时间线</h2>
        <div className="table-wrap"><table><thead><tr><th>时间</th><th>人员</th><th>方式</th><th>内容</th><th>下次跟进</th></tr></thead><tbody>{inquiry.followUps.map((f) => <tr key={f.id}><td>{formatDateTime(f.createdAt)}</td><td>{f.user.name}</td><td>{f.method}</td><td>{f.content}</td><td>{formatDateTime(f.nextFollowUpAt)}</td></tr>)}</tbody></table></div>
      </div>
    </AppShell>
  );
}

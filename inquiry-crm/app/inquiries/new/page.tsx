import { createInquiryAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { canSeeAllData, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function NewInquiryPage() {
  const user = await requireUser();
  const [users, fields, stages] = await Promise.all([
    prisma.user.findMany({ where: { role: "SALES", status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.customField.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } }),
    prisma.workflowStage.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } })
  ]);

  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>录入询盘</h1><p className="muted">业务员只能录入到自己名下，老板/管理员可指定负责人。</p></div></div>
      <form className="card form" action={createInquiryAction}>
        <div className="form-row">
          <label>询盘标题<input name="title" required placeholder="例如：德国客户询价数控设备" /></label>
          <label>客户姓名<input name="customerName" required /></label>
        </div>
        <div className="form-row">
          <label>客户公司<input name="customerCompany" /></label>
          <label>来源<input name="source" placeholder="官网、展会、阿里巴巴等" /></label>
        </div>
        <div className="form-row">
          <label>电话<input name="contactPhone" /></label>
          <label>邮箱<input name="contactEmail" type="email" /></label>
        </div>
        <div className="form-row">
          <label>意向产品<input name="productInterest" /></label>
          <label>预计金额<input name="estimatedAmount" type="number" step="0.01" /></label>
        </div>
        <div className="form-row">
          <label>优先级<select name="priority"><option value="1">高</option><option value="2">中</option><option value="3">低</option></select></label>
          <label>状态<select name="status">{stages.map((s) => <option key={s.id} value={s.status}>{s.name}</option>)}</select></label>
        </div>
        <div className="form-row">
          <label>下次跟进时间<input name="nextFollowUpAt" type="datetime-local" /></label>
          {canSeeAllData(user.role) && <label>负责人<select name="ownerId">{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>}
        </div>
        {fields.length > 0 && <h2>自定义字段</h2>}
        <div className="form-row">
          {fields.map((field) => (
            <label key={field.id}>{field.label}
              {field.type === "TEXTAREA" ? <textarea name={`custom_${field.key}`} required={field.required} /> : field.type === "SELECT" ? <select name={`custom_${field.key}`} required={field.required}>{(field.options ?? "").split(",").map((o) => <option key={o.trim()}>{o.trim()}</option>)}</select> : <input name={`custom_${field.key}`} type={field.type === "DATE" ? "date" : field.type === "NUMBER" ? "number" : "text"} required={field.required} />}
            </label>
          ))}
        </div>
        <button className="btn">保存询盘</button>
      </form>
    </AppShell>
  );
}

import { saveCustomFieldAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function FieldsPage() {
  const user = await requireRole(["ADMIN"]);
  const fields = await prisma.customField.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AppShell user={user}>
      <div className="topbar"><div><h1>自定义字段</h1><p className="muted">让询盘表单可以按业务变化添加字段。</p></div></div>
      <section className="grid grid-2"><form className="card form" action={saveCustomFieldAction}><h2>新增字段</h2><div className="form-row"><label>字段名<input name="label" required /></label><label>字段 key<input name="key" required placeholder="例如 customer_level" /></label></div><div className="form-row"><label>类型<select name="type"><option value="TEXT">文本</option><option value="TEXTAREA">多行文本</option><option value="NUMBER">数字</option><option value="DATE">日期</option><option value="SELECT">下拉选项</option></select></label><label>排序<input name="sortOrder" type="number" defaultValue="0" /></label></div><label>下拉选项（英文逗号分隔）<input name="options" placeholder="A类,B类,C类" /></label><label><span><input name="required" type="checkbox" /> 必填</span></label><button className="btn">保存字段</button></form><div className="card"><h2>字段列表</h2><div className="table-wrap"><table><thead><tr><th>名称</th><th>key</th><th>类型</th><th>必填</th></tr></thead><tbody>{fields.map((f) => <tr key={f.id}><td>{f.label}</td><td>{f.key}</td><td>{f.type}</td><td>{f.required ? "是" : "否"}</td></tr>)}</tbody></table></div></div></section>
    </AppShell>
  );
}

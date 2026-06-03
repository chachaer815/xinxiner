import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { canSeeAllData, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime, formatMoney, statusLabel } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireUser();
  const scope = canSeeAllData(user.role) ? {} : { ownerId: user.id };
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [total, todayNew, dueToday, overdue, inquiries, salesStats] = await Promise.all([
    prisma.inquiry.count({ where: scope }),
    prisma.inquiry.count({ where: { ...scope, createdAt: { gte: startOfToday, lt: endOfToday } } }),
    prisma.inquiry.count({ where: { ...scope, nextFollowUpAt: { gte: startOfToday, lt: endOfToday } } }),
    prisma.inquiry.count({ where: { ...scope, nextFollowUpAt: { lt: new Date() }, status: { notIn: ["WON", "LOST", "ARCHIVED"] } } }),
    prisma.inquiry.findMany({ where: scope, include: { owner: true }, orderBy: { updatedAt: "desc" }, take: 12 }),
    prisma.user.findMany({
      where: { role: "SALES" },
      include: { inquiries: { include: { followUps: true } } },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <AppShell user={user}>
      <div className="topbar">
        <div>
          <h1>首页数据统计</h1>
          <p className="muted">今日待跟进、新增询盘、逾期跟进和业务员跟进情况。</p>
        </div>
        <Link className="btn" href="/inquiries/new">新增询盘</Link>
      </div>
      <section className="grid grid-4" style={{ marginBottom: 18 }}>
        <div className="card"><div className="muted">总询盘</div><div className="stat-number">{total}</div></div>
        <div className="card"><div className="muted">今日新增</div><div className="stat-number">{todayNew}</div></div>
        <div className="card"><div className="muted">今日待跟进</div><div className="stat-number">{dueToday}</div></div>
        <div className="card"><div className="muted">逾期跟进</div><div className="stat-number">{overdue}</div></div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h2>最近询盘</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>客户</th><th>业务员</th><th>状态</th><th>金额</th><th>下次跟进</th></tr></thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr key={item.id}>
                    <td><Link href={`/inquiries/${item.id}`}>{item.customerName}</Link><div className="muted">{item.title}</div></td>
                    <td>{item.owner.name}</td>
                    <td><span className="badge">{statusLabel(item.status)}</span></td>
                    <td>{formatMoney(item.estimatedAmount)}</td>
                    <td>{formatDateTime(item.nextFollowUpAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <h2>业务员跟进情况</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>业务员</th><th>询盘数</th><th>跟进记录</th><th>成交</th></tr></thead>
              <tbody>
                {salesStats.map((sales) => (
                  <tr key={sales.id}>
                    <td>{sales.name}</td>
                    <td>{sales.inquiries.length}</td>
                    <td>{sales.inquiries.reduce((sum, item) => sum + item.followUps.length, 0)}</td>
                    <td>{sales.inquiries.filter((item) => item.status === "WON").length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

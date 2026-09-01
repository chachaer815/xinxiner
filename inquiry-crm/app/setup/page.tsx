export default function SetupPage() {
  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <h1>询盘 CRM 部署检查</h1>
      <p>
        这个项目不是纯静态页面，它需要 Next.js 服务端运行环境和数据库。若部署后页面打不开，优先检查下面几项。
      </p>
      <ol>
        <li>部署平台的 Root Directory / 项目根目录必须设置为 <code>inquiry-crm</code>。</li>
        <li>构建命令使用 <code>npm run build</code>，启动命令使用 <code>npm run start</code>。</li>
        <li>必须配置 <code>DATABASE_URL</code> 和 <code>AUTH_SECRET</code> 环境变量。</li>
        <li>首次部署后需要执行 <code>npm run db:push</code> 和 <code>npm run db:seed</code> 初始化数据库。</li>
        <li>如果部署到 Vercel、Netlify 这类 Serverless 平台，不建议用默认 SQLite 文件数据库；生产环境建议换 PostgreSQL。</li>
      </ol>
      <p>
        部署后可以访问 <code>/api/health</code> 查看环境变量和数据库连接是否正常。
      </p>
    </main>
  );
}

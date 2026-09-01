import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="card login-card">
        <h1>询盘跟进 CRM</h1>
        <p className="muted">业务员、老板、IT 管理员统一后台。</p>
        <LoginForm />
        <p className="muted" style={{ marginTop: 16 }}>演示账号：admin@example.com / password123</p>
      </div>
    </div>
  );
}

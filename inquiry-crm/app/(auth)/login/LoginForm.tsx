"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  return (
    <form className="form" action={formAction}>
      {state?.error && <div className="error">{state.error}</div>}
      <label>邮箱<input name="email" type="email" defaultValue="admin@example.com" required /></label>
      <label>密码<input name="password" type="password" defaultValue="password123" required /></label>
      <button className="btn" disabled={pending}>{pending ? "登录中..." : "登录"}</button>
    </form>
  );
}

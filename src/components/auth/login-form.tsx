"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/app/actions/auth";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signInAction, null);

  return (
    <form action={action} className="auth-form">
      <div className="field-group">
        <label htmlFor="login-email">Email address</label>
        <input
          autoComplete="username"
          className="form-input"
          id="login-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>
      <div className="field-group">
        <div className="field-label-row">
          <label htmlFor="login-password">Password</label>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <input
          autoComplete="current-password"
          className="form-input"
          id="login-password"
          maxLength={128}
          name="password"
          required
          type="password"
        />
      </div>
      {state && (
        <p className={`form-message form-message-${state.status}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}
      {!enabled && (
        <p className="form-message form-message-error" role="status">
          Account services are not configured for this deployment yet.
        </p>
      )}
      <button className="button button-primary auth-submit" disabled={!enabled || pending} type="submit">
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}

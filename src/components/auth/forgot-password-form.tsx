"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/app/actions/auth";

export function ForgotPasswordForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(requestPasswordResetAction, null);

  return (
    <form action={action} className="auth-form">
      <div className="field-group">
        <label htmlFor="reset-email">Email address</label>
        <input
          autoComplete="email"
          className="form-input"
          id="reset-email"
          maxLength={254}
          name="email"
          required
          type="email"
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
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}

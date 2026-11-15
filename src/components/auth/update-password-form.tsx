"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/app/actions/auth";

export function UpdatePasswordForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(updatePasswordAction, null);

  return (
    <form action={action} className="auth-form">
      <div className="field-group">
        <label htmlFor="new-password">New password</label>
        <input
          autoComplete="new-password"
          className="form-input"
          id="new-password"
          maxLength={128}
          minLength={12}
          name="password"
          required
          type="password"
        />
      </div>
      <div className="field-group">
        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input
          autoComplete="new-password"
          className="form-input"
          id="confirm-new-password"
          maxLength={128}
          minLength={12}
          name="confirmPassword"
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
        {pending ? "Updating password…" : "Update password"}
      </button>
    </form>
  );
}

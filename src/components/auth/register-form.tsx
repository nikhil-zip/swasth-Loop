"use client";

import { useActionState } from "react";
import { signUpPatientAction } from "@/app/actions/auth";

export function RegisterForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signUpPatientAction, null);

  return (
    <form action={action} className="auth-form">
      <div className="field-group">
        <label htmlFor="register-name">Full name</label>
        <input
          autoComplete="name"
          className="form-input"
          id="register-name"
          maxLength={120}
          minLength={2}
          name="fullName"
          required
          type="text"
        />
      </div>
      <div className="field-group">
        <label htmlFor="register-email">Email address</label>
        <input
          autoComplete="email"
          className="form-input"
          id="register-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>
      <div className="field-group">
        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          className="form-input"
          id="register-password"
          maxLength={128}
          minLength={12}
          name="password"
          required
          type="password"
        />
        <span className="field-help">Use 12 to 128 characters.</span>
      </div>
      <div className="field-group">
        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          autoComplete="new-password"
          className="form-input"
          id="register-confirm-password"
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
        {pending ? "Creating account…" : "Create patient account"}
      </button>
      <p className="auth-form-note">All new accounts start as patient accounts. Doctors can apply after signing in.</p>
    </form>
  );
}

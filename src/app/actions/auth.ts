"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthActionState = {
  status: "error" | "success";
  message: string;
} | null;

function textValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function rawValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password: string): boolean {
  return password.length >= 12 && password.length <= 128;
}

async function siteOrigin(): Promise<string> {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) {
    const configuredUrl = new URL(configuredSiteUrl);
    if (configuredUrl.protocol !== "https:" && configuredUrl.hostname !== "localhost") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost.");
    }
    return configuredUrl.origin;
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (origin) return new URL(origin).origin;

  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return new URL(`${protocol}://${host}`).origin;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = textValue(formData, "email").toLowerCase();
  const password = rawValue(formData, "password");

  if (!validEmail(email) || password.length === 0) {
    return { status: "error", message: "Enter a valid email address and password." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Account services are not configured for this deployment yet." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { status: "error", message: "We couldn't sign you in with those details. Check them and try again." };
    }
  } catch {
    return { status: "error", message: "Sign-in is temporarily unavailable. Try again later." };
  }

  redirect("/account");
}

export async function signUpPatientAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = textValue(formData, "fullName");
  const email = textValue(formData, "email").toLowerCase();
  const password = rawValue(formData, "password");
  const confirmPassword = rawValue(formData, "confirmPassword");

  if (fullName.length < 2 || fullName.length > 120) {
    return { status: "error", message: "Enter your name (2 to 120 characters)." };
  }
  if (!validEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (!validPassword(password)) {
    return { status: "error", message: "Use a password between 12 and 128 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "The passwords do not match." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Account services are not configured for this deployment yet." };
  }

  let hasSession = false;
  try {
    const supabase = await createSupabaseServerClient();
    const origin = await siteOrigin();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: new URL("/account", origin).toString(),
      },
    });
    if (error) {
      return { status: "error", message: "We couldn't complete registration. Check your details or try again later." };
    }
    hasSession = Boolean(data.session);
  } catch {
    return { status: "error", message: "Registration is temporarily unavailable. Try again later." };
  }
  if (hasSession) redirect("/account");

  // Keep the response neutral so it does not confirm whether an email is registered.
  return {
    status: "success",
    message: "If registration completed, check your email for a confirmation link. Then sign in to continue.",
  };
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = textValue(formData, "email").toLowerCase();
  if (!validEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Account services are not configured for this deployment yet." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const origin = await siteOrigin();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("/account/update-password", origin).toString(),
    });
    if (error) {
      return { status: "error", message: "We couldn't request a reset email. Try again later." };
    }
  } catch {
    return { status: "error", message: "Password recovery is temporarily unavailable. Try again later." };
  }

  return {
    status: "success",
    message: "If an account matches that email, a password reset message will be sent.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = rawValue(formData, "password");
  const confirmPassword = rawValue(formData, "confirmPassword");
  if (!validPassword(password)) {
    return { status: "error", message: "Use a password between 12 and 128 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "The passwords do not match." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Account services are not configured for this deployment yet." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return { status: "error", message: "Your recovery session expired. Request a new reset email." };
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { status: "error", message: "We couldn't update the password. Request a new reset email and try again." };
    }
  } catch {
    return { status: "error", message: "Password update is temporarily unavailable. Try again later." };
  }

  redirect("/account?message=password-updated");
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // Always return the browser to the signed-out entry point.
    }
  }
  redirect("/login?message=signed-out");
}

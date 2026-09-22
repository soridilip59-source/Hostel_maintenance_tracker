import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthShell, { PasswordField } from "./AuthShell";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const finishLogin = (user, token) => {
    if (!user?.role || !token) {
      setError("Login response was incomplete. Please try again.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("user", JSON.stringify(user));
    navigate(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard", { replace: true });
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      finishLogin(data.user, data.token);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (requestError.request ? "Cannot reach the backend server" : "Login failed")
      );
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async (googleResponse) => {
    const credential = googleResponse?.credential;

    if (!credential) {
      setError("Google login was cancelled or failed");
      return;
    }

    setGoogleBusy(true);
    setError("");

    try {
      const { data } = await api.post("/auth/google", { credential });
      finishLogin(data.user, data.token);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Google login failed");
    } finally {
      setGoogleBusy(false);
    }
  };

  const roleSelector = (
    <div className="role-switch" aria-label="Choose user role">
      <button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
        Student
      </button>
      <button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>
        Administrator
      </button>
    </div>
  );

  const googleButton = import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
    <div className="google-area">
      <div className="divider">
        <span>or continue with</span>
      </div>
      <div className="google-login">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google login was cancelled or failed")}
          useOneTap={false}
        />
      </div>
    </div>
  ) : null;

  return (
    <AuthShell
      mode="login"
      title="Welcome back!"
      subtitle={`Sign in to manage your hostel${role === "admin" ? " operations" : " experience"}.`}
      error={error}
      footer={<span>Don’t have an account?</span>}
      roleSelector={roleSelector}
      google={googleButton}
      loading={googleBusy}
    >
      <form className="auth-form" onSubmit={handleEmailLogin} noValidate>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">✉</span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              spellCheck={false}
              required
            />
          </div>
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
        />

        <div className="auth-actions">
          <button type="submit" className="primary-button" disabled={busy || googleBusy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

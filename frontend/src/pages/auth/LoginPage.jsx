import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { api } from "../../api/endpoints";
import { authStore } from "../../auth/auth.store";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import AuthNexusLayout from "./AuthNexusLayout";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import AuthDivider from "../../components/auth/AuthDivider";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from;
  const redirectTo =
    typeof from === "string"
      ? from
      : from?.pathname
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/app/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await api.auth.login({ email, password });

      // acceptă orice format: {token,user} sau {accessToken,user} etc.
      const token = data.token || data.accessToken || data.jwt || data?.data?.token;
      const user = data.user || data.profile || data?.data?.user || { email };
      const refreshToken = data.refreshToken || data?.data?.refreshToken;

      if (!token) throw new Error("Login response missing token.");

      authStore.setAuth({ token, user, refreshToken });
      toastSuccess("Welcome back!");
      nav(redirectTo, { replace: true });
    } catch (e2) {
      setError("Invalid credentials. Please try again.");
      toastError(e2, "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  const handleOAuthSuccess = () => {
    nav(redirectTo, { replace: true });
  };

  return (
    <AuthNexusLayout
      title="Welcome Back"
      subtitle="Sign in to manage your farms"
      footer={
        <div className="space-y-2">
          <div>
            <Link
              className="text-primary hover:underline font-medium transition-all hover:text-primary/80"
              to="/auth/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <div>
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/auth/register"
              className="text-primary hover:underline font-medium transition-all hover:text-primary/80"
            >
              Sign up
            </Link>
          </div>
        </div>
      }
    >
      {/* Google OAuth Section */}
      <Motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <GoogleSignInButton onSuccess={handleOAuthSuccess} disabled={busy} />
      </Motion.div>

      {/* Divider */}
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <AuthDivider />
      </Motion.div>

      {/* Traditional Login Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </Motion.div>
        ) : null}

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
              required
              autoComplete="email"
            />
          </div>
        </Motion.div>

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
              required
              autoComplete="current-password"
            />
            <Motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Motion.button>
          </div>
        </Motion.div>

        <Motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (
              <Motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                Signing in...
              </Motion.span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        </Motion.div>
      </form>
    </AuthNexusLayout>
  );
}
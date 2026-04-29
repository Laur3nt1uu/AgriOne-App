import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles, User, UserCircle } from "lucide-react";
import { api } from "../../api/endpoints";
import { authStore } from "../../auth/auth.store";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import AuthNexusLayout from "./AuthNexusLayout";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import AuthDivider from "../../components/auth/AuthDivider";

export default function RegisterPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthSuccess = () => {
    nav("/app/dashboard", { replace: true });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toastError(null, "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toastError(null, "Password must be at least 6 characters");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        email,
        password,
        username: username.trim() || undefined,
        name: name.trim() || undefined,
      };
      const data = await api.auth.register(payload);

      // Backend returns tokens on register — auto-login the user
      const token = data.token || data.accessToken || data.jwt || data?.data?.token;
      const user = data.user || data.profile || data?.data?.user || { email };
      const refreshToken = data.refreshToken || data?.data?.refreshToken;

      if (token) {
        authStore.setAuth({ token, user, refreshToken });
        toastSuccess("Account created successfully!");
        nav("/app/dashboard", { replace: true });
      } else {
        toastSuccess("Account created. You can sign in now.");
        nav("/auth/login", { replace: true });
      }
    } catch (e2) {
      setError("Registration failed. Please try again.");
      toastError(e2, "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthNexusLayout
      title="Get Started"
      subtitle="Create your AgriOne account"
      footer={
        <div>
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/auth/login" className="text-primary hover:underline font-medium transition-all hover:text-primary/80">
            Sign in
          </Link>
        </div>
      }
    >
      {/* Google OAuth Section */}
      <Motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <GoogleSignInButton onSuccess={handleOAuthSuccess} disabled={busy} />
      </Motion.div>

      {/* Divider */}
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <AuthDivider text="sau creează un cont" />
      </Motion.div>

      {/* Traditional Register Form */}
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

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Label htmlFor="name">Nume complet</Label>
          <div className="relative mt-1.5">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="ex: Popescu Ion"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
              autoComplete="name"
            />
          </div>
        </Motion.div>

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Label htmlFor="username">Username (optional)</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="ex: ion.popescu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
              autoComplete="username"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Litere/cifre, ., _, - (3–30 caractere).</div>
        </Motion.div>

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
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

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
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
              autoComplete="new-password"
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

        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
              required
              autoComplete="new-password"
            />
          </div>
        </Motion.div>

        <Motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.36 }}>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (
              <Motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                Creating account...
              </Motion.span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Account
              </>
            )}
          </Button>
        </Motion.div>
      </form>
    </AuthNexusLayout>
  );
}

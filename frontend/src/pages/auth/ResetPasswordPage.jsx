import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import AuthNexusLayout from "./AuthNexusLayout";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(false);

    if (!token) {
      toastError(null, "Link invalid: lipsește token-ul de resetare.");
      return;
    }

    setBusy(true);
    try {
      await api.auth.resetPassword({ token, password });
      setOk(true);
      toastSuccess("Parola a fost actualizată.");
      setTimeout(() => nav("/login"), 900);
    } catch (e2) {
      toastError(e2, "Resetare eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthNexusLayout
      title="Set New Password"
      subtitle="Choose a new password for your account"
      footer={
        <div>
          <span className="text-muted-foreground">Back to </span>
          <Link to="/login" className="text-primary hover:underline font-medium transition-all hover:text-primary/80">
            sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Label htmlFor="password">New Password</Label>
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

        {ok ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-sm"
          >
            Password updated. Redirecting to sign in...
          </Motion.div>
        ) : null}

        <Motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Updating..." : (
              <>
                <Sparkles className="w-4 h-4" />
                Update password
              </>
            )}
          </Button>
        </Motion.div>
      </form>
    </AuthNexusLayout>
  );
}

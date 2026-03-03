import { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import AuthNexusLayout from "./AuthNexusLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(false);
    setBusy(true);
    try {
      await api.auth.forgotPassword({ email });
      setOk(true);
      toastSuccess("Dacă emailul există, am trimis un link de resetare.");
    } catch (e2) {
      toastError(e2, "Cerere eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthNexusLayout
      title="Reset Password"
      subtitle="We'll email you a reset link"
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

        {ok ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-sm"
          >
            If the email exists, a reset link was sent.
          </Motion.div>
        ) : null}

        <Motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Sending..." : (
              <>
                <Sparkles className="w-4 h-4" />
                Send reset link
              </>
            )}
          </Button>
        </Motion.div>
      </form>
    </AuthNexusLayout>
  );
}

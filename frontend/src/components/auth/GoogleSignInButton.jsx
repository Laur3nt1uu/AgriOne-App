import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { api } from "../../api/endpoints";
import { googleOAuth } from "../../auth/google-oauth.service";
import { authStore } from "../../auth/auth.store";
import { toastError, toastSuccess } from "../../utils/toast";

export default function GoogleSignInButton({ onSuccess, disabled = false }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || disabled) return;

    setLoading(true);
    try {
      // Initialize Google OAuth (will load script if needed)
      await googleOAuth.initialize(import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id');

      // Sign in with Google
      const result = await googleOAuth.signIn();

      // Send Google token to backend for verification/login
      const data = await api.auth.googleLogin({
        credential: result.credential,
        user: result.user,
      });

      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) throw new Error("Backend authentication failed");

      // Store authentication with OAuth metadata
      authStore.setGoogleAuth({
        token,
        user: { ...(data?.user || result.user), provider: "google" },
        googleToken: result.credential,
      });

      const displayName = data?.user?.name || result?.user?.name || "utilizator";
      toastSuccess(`Bun venit, ${displayName}!`);
      onSuccess?.(data);

    } catch (error) {
      console.error('Google Sign-In error:', error);
      toastError(error, 'Autentificarea Google a eșuat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={loading || disabled}
      className="relative w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-2xl bg-card hover:bg-secondary/50 transition-colors font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      {loading ? (
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
        />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      <span>{loading ? 'Se conectează...' : 'Continuă cu Google'}</span>
    </Motion.button>
  );
}
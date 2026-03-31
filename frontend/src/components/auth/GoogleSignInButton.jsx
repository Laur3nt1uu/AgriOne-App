import { useState, useRef, useEffect, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import { api } from "../../api/endpoints";
import { googleOAuth } from "../../auth/google-oauth.service";
import { authStore } from "../../auth/auth.store";
import { toastError, toastSuccess } from "../../utils/toast";

export default function GoogleSignInButton({ onSuccess, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  const buttonContainerRef = useRef(null);
  const initializedRef = useRef(false);

  const handleGoogleResult = useCallback(async (result) => {
    setLoading(true);
    try {
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
        refreshToken: data?.refreshToken,
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
  }, [onSuccess]);

  useEffect(() => {
    if (initializedRef.current || !buttonContainerRef.current) return;
    initializedRef.current = true;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your-google-client-id') {
      setInitError('Google Client ID not configured');
      return;
    }

    (async () => {
      try {
        await googleOAuth.initialize(clientId);
        googleOAuth.renderButton(buttonContainerRef.current, (err, result) => {
          if (err) {
            console.error('Google OAuth error:', err);
            toastError(err, 'Autentificarea Google a eșuat.');
            return;
          }
          handleGoogleResult(result);
        });
      } catch (err) {
        console.error('Failed to initialize Google OAuth:', err);
        setInitError(err.message);
      }
    })();
  }, [handleGoogleResult]);

  if (initError) {
    return (
      <div className="w-full p-3 text-center text-sm text-muted-foreground border border-border/50 rounded-2xl">
        Google Sign-In indisponibil
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Google rendered button container */}
      <div
        ref={buttonContainerRef}
        className={`w-full flex justify-center [&>div]:!w-full ${disabled || loading ? 'pointer-events-none opacity-50' : ''}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-2xl">
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
          <span className="ml-2 text-sm text-muted-foreground">Se conectează...</span>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/endpoints";
import { authStore } from "../../auth/auth.store";
import { googleOAuth } from "../../auth/google-oauth.service";
import { toastError, toastSuccess } from "../../utils/toast";
import LoadingScreen from "../../components/LoadingScreen";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        const returnTo = searchParams.get('returnTo') || '/app/dashboard';
        const provider = searchParams.get('provider') || 'google';
        const credential = searchParams.get('credential'); // For redirect-based OAuth

        // If we have a credential parameter, process it
        if (credential) {
          setStatus("authenticating");

          // Decode the credential to get user info
          const payload = JSON.parse(atob(credential.split('.')[1]));
          const userData = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            provider: 'google'
          };

          // Send to backend for verification
          const data = await api.auth.googleLogin({
            credential: credential,
            user: userData,
          });

          const token = data?.token || data?.accessToken || data?.jwt;
          if (!token) throw new Error("Backend authentication failed");

          // Store authentication
          authStore.setGoogleAuth({
            token,
            user: { ...(data?.user || userData), provider: "google" },
            googleToken: credential,
          });

          const displayName = data?.user?.name || userData?.name || "utilizator";
          toastSuccess(`Bun venit, ${displayName}!`);

          setStatus("success");
          navigate(returnTo, { replace: true });
          return;
        }

        // Check if we're already authenticated (direct flow completed)
        if (authStore.isAuthed()) {
          setStatus("success");
          navigate(returnTo, { replace: true });
          return;
        }

        // Try to initialize Google OAuth in case of direct flow
        try {
          await googleOAuth.initialize(import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id');
          // If direct flow is available, redirect to login page for user interaction
          setStatus("redirecting");
          setTimeout(() => {
            navigate('/auth/login', {
              replace: true,
              state: {
                from: returnTo === '/app/dashboard' ? undefined : returnTo
              }
            });
          }, 1500);
        } catch (error) {
          throw new Error("OAuth initialization failed");
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus("error");
        toastError(error, "Autentificarea a eșuat. Te rugăm să încerci din nou.");

        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 3000);
      }
    }

    handleOAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <LoadingScreen />

        {status === "processing" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Procesare autentificare...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Verificăm datele de autentificare.
            </p>
          </>
        )}

        {status === "authenticating" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Autentificare în curs...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Conectare cu Google.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="mt-4 text-foreground font-medium">
              Autentificare reușită!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Redirecționare la aplicație...
            </p>
          </>
        )}

        {status === "redirecting" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Redirecționare...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te vom redirecționa la pagina de conectare.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="mt-4 text-destructive font-medium">
              Eroare de autentificare
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te vom redirecționa la pagina de conectare.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
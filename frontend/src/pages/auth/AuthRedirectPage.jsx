import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleOAuth } from "../../auth/google-oauth.service";
import { toastError } from "../../utils/toast";
import LoadingScreen from "../../components/LoadingScreen";

export default function AuthRedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("preparing");

  useEffect(() => {
    async function handleOAuthRedirect() {
      try {
        const action = searchParams.get('action') || 'login';
        const provider = searchParams.get('provider') || 'google';
        const returnTo = searchParams.get('returnTo') || '/app/dashboard';

        setStatus("initializing");

        // Initialize OAuth provider
        if (provider === 'google') {
          await googleOAuth.initialize(import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id');

          // For Google Identity Services, we use the direct flow instead of redirect
          // Redirect to appropriate auth page with preserved parameters
          const redirectPath = action === 'signup' ? '/auth/register' : '/auth/login';
          const state = returnTo !== '/app/dashboard' ? { from: returnTo } : undefined;

          setStatus("redirecting");
          setTimeout(() => {
            navigate(redirectPath, {
              replace: true,
              state: state
            });
          }, 1000);
        } else {
          // Handle other OAuth providers here in the future
          throw new Error(`Unsupported OAuth provider: ${provider}`);
        }

      } catch (error) {
        console.error('OAuth redirect error:', error);
        setStatus("error");
        toastError(error, "Eroare la inițializarea OAuth. Te rugăm să încerci din nou.");

        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2000);
      }
    }

    handleOAuthRedirect();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <LoadingScreen />

        {status === "preparing" && (
          <p className="mt-4 text-muted-foreground">
            Pregătire autentificare...
          </p>
        )}

        {status === "initializing" && (
          <p className="mt-4 text-muted-foreground">
            Inițializare OAuth...
          </p>
        )}

        {status === "redirecting" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Redirecționare...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te vom duce la pagina de autentificare.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="mt-4 text-destructive font-medium">
              Eroare de inițializare
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
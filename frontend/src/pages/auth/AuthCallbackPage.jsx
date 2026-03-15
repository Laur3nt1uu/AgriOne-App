import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

export default function AuthCallbackPage() {
  const { handleRedirectCallback, isLoading, error, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to intended page or dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo') || '/app/dashboard';
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Eroare de autentificare</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Înapoi la aplicație
          </button>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
}
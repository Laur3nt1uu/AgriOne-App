import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

export default function AuthRedirectPage({ action = "login" }) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const authParams = action === "signup"
        ? { authorizationParams: { screen_hint: "signup" } }
        : {};

      loginWithRedirect(authParams);
    } else {
      // Use navigate instead of window.location.href for React Router compliance
      navigate("/app/dashboard", { replace: true });
    }
  }, [loginWithRedirect, isAuthenticated, action, navigate]);

  return <LoadingScreen />;
}
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import LoadingScreen from "./components/LoadingScreen";
import { prefetchCommonAppRoutes } from "./router/chunks";

export default function AppWrapper() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");

    const run = () => prefetchCommonAppRoutes();
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(run, 650);
    }
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return <RouterProvider router={router} />;
}

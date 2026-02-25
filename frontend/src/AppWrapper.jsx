import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import LoadingScreen from "./components/LoadingScreen";

export default function AppWrapper() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return <RouterProvider router={router} />;
}

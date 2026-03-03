import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgb(var(--card) / 0.92)",
          color: "rgb(var(--foreground) / 0.92)",
          border: "1px solid rgb(var(--border) / 0.12)",
          boxShadow: "0 16px 40px rgb(var(--foreground) / 0.10)",
        },
      }}
    />
  </React.StrictMode>
);
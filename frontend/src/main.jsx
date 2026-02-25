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
          background: "rgba(255, 255, 255, 0.92)",
          color: "rgba(15, 23, 42, 0.92)",
          border: "1px solid rgba(15, 23, 42, 0.12)",
          boxShadow: "0 16px 40px rgba(2, 6, 23, 0.12)",
        },
      }}
    />
  </React.StrictMode>
);
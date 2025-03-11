import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routers/AppRouters.tsx"; // import AppRoutes
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ✅ Wrap AppRoutes with LoadingProvider */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  </StrictMode>,
);

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

// Suppress Radix UI forwardRef warning (library limitation, not app code) -- fix warning library issue
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Function components cannot be given refs')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  
// src/App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import WalletPage from "./pages/Wallet.jsx";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      const decoded = decodeURIComponent(redirect);
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const cleaned = decoded.startsWith(base) ? decoded.slice(base.length) : decoded;

      window.history.replaceState(null, "", cleaned || "/");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/wallet" element={<WalletPage />} />
    </Routes>
  );
}

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import WalletPage from "./pages/Wallet.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/wallet" element={<WalletPage />} />
    </Routes>
  );
}

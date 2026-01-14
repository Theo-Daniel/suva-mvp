// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import WalletPage from "./pages/Wallet.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </BrowserRouter>
  );
}

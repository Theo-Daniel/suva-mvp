// src/pages/Landing.jsx
//import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import whiteLogo from "../assets/WHITE.png";
import step1Img from "../assets/S1_img.png";
import xMark from "../assets/X_Mark.png";

const posterUrl = new URL("../videos/poster.jpg", import.meta.url).href;
const mobileVideoUrl = new URL("../videos/mobile-video.mp4", import.meta.url).href;
const desktopVideoUrl = new URL("../videos/Landing-video.mp4", import.meta.url).href;

export default function Landing() {
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setShowIntro(true);
    }, 3000); // ✅ 3 seconds

    return () => clearTimeout(timerId); // ✅ cleanup if page changes quickly
  }, []);

  const goToWallet = () => navigate("/wallet");

  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          className="pointer-events-none h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
        >
          {/* mobile */}
          <source
            src={mobileVideoUrl}
            type="video/mp4"
            media="(max-width: 767px)"
          />

          {/* desktop */}
          <source
            src={desktopVideoUrl}
            type="video/mp4"
            media="(min-width: 768px)"
          />

          {/* fallback */}
          <source src={desktopVideoUrl} type="video/mp4" />
        </video>

        {/* bottom blend */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d0e0e] to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-[7px] text-center bg-transparent">
        <img
          src={whiteLogo}
          alt="SUVA"
          className="mx-auto h-[27px] md:h-[32px] lg:h-[37px] object-contain"
        />
        <div className="mt-[4.5px] mx-auto h-px w-[75%] bg-gradient-to-r from-transparent via-[#eaeaea] to-transparent opacity-60" />
      </header>

      {/* Page Content */}
      <main className="relative z-10 flex justify-center overflow-hidden px-6 pb-16 pt-2 lg:px-10 xl:px-16 min-h-[95vh]">
        <section className="relative z-10 mx-auto w-full text-center">
          <h1
            className="
              mt-2
              [font-family:'TerminaTest',sans-serif]
              text-[#e7e7ea]
              text-[20px] sm:text-[20px] md:text-[23px] lg:text-[26px]
              leading-[1.2] tracking-[0.01em]"
          >
            <span className="block text-[#d6d6d6]">Quantum-Safe</span>
            <span className="block text-[#a8a9ac]">Crypto Security</span>
          </h1>

          <p
            className="
              mt-4
              mx-auto text-sm text-[#eaeaea]
              [font-family:'NeueHaasDisplay',sans-serif]
              font-light tracking-wide leading-snug
              text-[8px] sm:text-[11px] md:text-[13px] lg:text-[15px]"
          >
            The Suva Protocol is designed to secure cryptographic assets against potential threats from quantum computers.
          </p>

          {/* Create wallet button */}
          <div
            onClick={goToWallet}
            className="mt-6 relative py-3 px-7 w-fit rounded-[19px] select-none cursor-pointer suva-button mx-auto button-glimmer button-glimmer-neutral group"
          >
            <div
              className="absolute w-[calc(100%-2px)] h-[calc(100%-2px)] top-[1px] left-[1px] z-10 bg-[#0B0B0B]
                         transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.35)]
                         group-hover:brightness-125"
              style={{ borderRadius: 19 }}
            />
            <div
              className="relative text-sm text-nowrap z-20 text-[#eaeaea]
                         transition-colors duration-300 group-hover:text-white
                         [font-family:'NeueHaasDisplayMediu',sans-serif]"
            >
              Create Wallet
            </div>
          </div>
        </section>

        {/* Guide card */}
        {showIntro && (
          <div className="guide-popover">
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[3px]"
              aria-label="Close intro"
              onClick={() => setShowIntro(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              className="
                fixed left-1/2 top-1/2 z-50
                w-[92vw] max-w-[580px]
                -translate-x-1/2 -translate-y-[55%] md:-translate-y-[150%]
                rounded-2xl bg-[#181818]
                outline outline-1 outline-[#363636]
                shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              "
            >            
              <div className="mt-2 flex items-start justify-between">
                <img src={step1Img} alt="" className="ml-2 w-16" />
                <button
                  type="button"
                  className="mr-2 w-8 cursor-pointer"
                  onClick={() => setShowIntro(false)}
                  aria-label="Close"
                >
                  <img src={xMark} alt="" />
                </button>
              </div>

              <div className="mt-5">
                <div className="ml-5 [font-family:'NeueHaasDisplayMediu',sans-serif] text-[15px] font-medium text-[#f2f2f2]">
                  Step 01: Create a wallet.
                </div>
              </div>

              <div className="mb-5 mt-3 px-4 sm:px-5 [font-family:'NeueHaasDisplay',sans-serif] text-left text-[15px] font-normal text-[#898989]">
                Welcome to SUVA, your gateway to quantum-safe crypto security! Let’s create your wallet to get started.
                Click the glowing ‘Create Wallet’ button below.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

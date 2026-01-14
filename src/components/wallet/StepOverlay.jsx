// src/components/wallet/StepOverlay.jsx
import React from "react";
import defaultIcon from "../../assets/S1_img.png";
import closeIcon from "../../assets/X_Mark.png";

/**
 * Landing-style step overlay used on the wallet flow.
 * Keeps logic minimal: just open/close + title + body.
 */
export default function StepOverlay({
  open = false,
  onClose,
  title,
  children,
  iconSrc = defaultIcon,
}) {
  if (!open) return null;

  return (
    <div className="guide-popover">
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[3px]"
        aria-label="Close overlay"
        onClick={onClose}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          fixed left-1/2 top-1/2 z-50
          w-[92%] max-w-[580px]
          -translate-x-1/2 -translate-y-1/2
          md:top-[37%] md:-translate-y-[100%]
          rounded-2xl bg-[#181818]
          outline outline-1 outline-[#363636]
          shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header row (icon + close) */}
        <div className="mt-2 flex items-start justify-between">
          {!!iconSrc && (
            <img src={iconSrc} alt="" className="ml-2 w-16 select-none" />
          )}
          <button
            type="button"
            className="mr-2 w-8 cursor-pointer opacity-80 hover:opacity-100 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <img src={closeIcon} alt="Close" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-5">
          <div className="ml-5 [font-family:'NeueHaasDisplayMediu',sans-serif] text-[15px] font-medium text-[#f2f2f2]">
            {title}
          </div>
        </div>

        {/* Body */}
        <div className="mb-5 mt-3 px-4 md:px-5 [font-family:'NeueHaasDisplay',sans-serif] text-left text-[15px] font-normal text-[#898989]">
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3600);
    const hideTimer = setTimeout(() => setVisible(false), 4800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f2557] transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/logo-splash.svg"
        alt="Everypart"
        className="splash-logo w-[min(700px,85vw)]"
      />
      <span
        className="splash-slogan mt-6 text-sm font-medium tracking-[0.35em] uppercase text-white/70"
      >
        Соединяем производство и бизнес
      </span>
      <div className="splash-slogan mt-8 w-[min(260px,60vw)] h-[2px] rounded-full bg-white/10 overflow-hidden">
        <div className="splash-progress h-full rounded-full bg-white/40" />
      </div>
    </div>
  );
}

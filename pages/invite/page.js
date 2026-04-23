"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- COUNTDOWN ---------------- */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();

      return {
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/* ---------------- ANIMATED NUMBER ---------------- */
function AnimatedNumber({ value }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.9 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="text-4xl font-wedding text-[#b08968]"
      >
        {value}
      </motion.div>
    </AnimatePresence>
  );
}
function Loader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f7f0e8] relative overflow-hidden">
      <p className="font-wedding text-lg text-gray-700 text-center animate-pulse max-w-xs">
        Opening your invitation...
      </p>

      <div className="mt-5 w-32 h-[2px] bg-[#d4a373] rounded-full animate-pulse"></div>

      <p className="text-xs text-gray-400 mt-4 text-center font-body">
        Please wait a moment ✨
      </p>
    </div>
  );
}
/* ---------------- MAIN ---------------- */
export default function GeneralInvitation() {
  const countdown = useCountdown("2026-05-25T11:00:00");
  const [loading, setLoading] = useState(true);

  /* LOADER */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#f8f1ea] flex flex-col items-center px-6 py-14"
    >
      {/* 🌸 FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#d4a373]/30 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 💌 HEADER */}
      <p className="text-[#a67c52] text-lg mt-6 font-wedding text-center">
        With love, we invite you to celebrate with us 🤍
      </p>

      {/* ✨ MESSAGE */}
      <p className="mt-5 text-center text-gray-600 max-w-md font-wedding leading-relaxed">
        It would mean so much to have you with us as we begin this new chapter
        of our lives together
      </p>

      {/* 💍 NAMES */}
      <div className="mt-10 text-center">
        <p className="text-xs tracking-[4px] text-gray-500 uppercase font-body">
          We are getting married
        </p>

        <h1 className="mt-3">
          <span className="block font-display text-6xl text-[#b08968]">
            Stanly
          </span>

          <span className="text-2xl text-[#d4a373]">&</span>

          <span className="block font-display text-6xl text-[#b08968]">
            Anisha
          </span>
        </h1>

        <p className="mt-3 text-sm text-gray-500 font-body italic">
          Two hearts. One promise. A lifetime ahead.
        </p>
      </div>

      {/* 📅 DATE */}
      <div className="mt-10 text-center">
        <p className="text-xs tracking-[4px] text-gray-500 uppercase font-body">
          Save the Date
        </p>

        <p className="font-wedding text-3xl text-[#b08968] mt-2">
          25 May 2026 • 11:00 AM
        </p>
      </div>

      {/* ⏳ COUNTDOWN */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-xs tracking-[4px] uppercase text-center text-gray-500 font-body">
          Countdown to our wedding ceremony
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Minutes", value: countdown.minutes },
            { label: "Seconds", value: countdown.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl py-4 px-5 shadow-sm"
            >
              <AnimatedNumber value={item.value} />

              <div className="text-[10px] tracking-[3px] uppercase text-gray-500 mt-1 font-body">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📍 VENUE */}
      <div className="mt-14 w-full max-w-md text-center z-10">
        <p className="text-sm text-gray-600 font-wedding leading-relaxed">
          With the blessings of our families, we warmly invite you to our
          wedding celebrations.
        </p>

        {/* CEREMONY */}
        <p className="mt-8 text-gray-500 text-sm">
          The wedding ceremony will be held at
        </p>

        <p className="font-serif text-lg text-[#b08968] mt-2">
          St Antony's Church
        </p>

        <p className="text-sm text-gray-600">Manjalampuram</p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=St+Antony's+Church+Manjalampura"
          target="_blank"
          className="text-xs text-[#d4a373] mt-2 inline-block underline"
        >
          Open in Google Maps
        </a>

        <p className="text-xs text-gray-500 mt-1">11:00 AM</p>

        {/* divider */}
        <div className="my-6 w-24 h-[1px] bg-[#d4a373]/40 mx-auto"></div>

        {/* RECEPTION */}
        <p className="text-gray-500 text-sm">Followed by a reception at</p>

        <p className="font-serif text-lg text-[#b08968] mt-2">
          St George Convention Centre
        </p>

        <p className="text-sm text-gray-600">Adakkathode Road, Kelakam</p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=St+George+Convention+Centre+Kelakam"
          target="_blank"
          className="text-xs text-[#d4a373] mt-2 inline-block underline"
        >
          Open in Google Maps
        </a>
      </div>

      {/* 💖 FOOTER */}
      <p className="mt-10 text-[#b08968]">
        We look forward to celebrating with you 🤍
      </p>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import Link from "next/link";
import Head from "next/head";

const getStatusForIndex = (index: number, currentRound: number) => {
  const start = (currentRound - 1) * 3;
  const end = start + 3;
  const prepareEnd = end + 3;

  if (index >= start && index < end) return "active";
  if (index >= end && index < prepareEnd) return "prepare";
  if (index >= prepareEnd) return "rest";
  return "done";
};

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [config, setConfig] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [curRound, setCurRound] = useState(1);

  // Initial load from localStorage
  useEffect(() => {
    const stored = getFromStorage();
    console.log(stored);
    if (stored) {
      setConfig(stored);
      setCurRound(stored.currentRound);
      console.log(stored);
      const elapsed = Math.floor(
        (Date.now() - stored.currentCountdownStartTime) / 1000
      );
      const remaining = Math.max(stored.totalCountdown - elapsed, 0);
      console.log(remaining);
      setTimeLeft(remaining);
    }
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!config || config.status === "done") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextRound = config.currentRound + 1;

          // Cek jika udah mencapai ronde terakhir
          if (nextRound > config.maxRound) {
            clearInterval(interval);
            const newConfig = { ...config, status: "done" };
            saveToStorage(newConfig);
            setConfig(newConfig);
            return 0;
          }

          const newConfig = {
            ...config,
            currentRound: nextRound,
            currentCountdownStartTime: Date.now(),
          };

          saveToStorage(newConfig);
          setConfig(newConfig);
          setCurRound(nextRound);
          return newConfig.totalCountdown;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config]);
  console.log(config);

  const renderParticipant = () => {
    if (!config) {
      return (
        <div className="flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return config.participants?.map((p: any, index: number) => {
      const status = getStatusForIndex(index, config.currentRound);
      const backgroundColor = config.backgrounds?.[status] || "#e5e7eb";
      const color = config.textColors?.[status] || "#000000";

      return (
        <div
          key={p.id}
          className="p-4 rounded-xl shadow-md"
          style={{ backgroundColor, color }}
        >
          <p className="font-semibold text-base">{p.name}</p>
          <p className="text-sm capitalize mt-1">
            Status: <strong>{status}</strong>
          </p>
        </div>
      );
    });
  };

  if (config === null)
    return (
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/sekolahmoehi.jpg"
            alt="Background Sekolah"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h2 className="text-cyan-400 text-3xl md:text-6xl font-bold [text-shadow:_0_0_10px_rgba(34,211,238,0.8)] mb-4">
            Sistem Timer Peserta LKS
          </h2>
          <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold [text-shadow:_0_0_8px_rgba(34,211,238,0.7)] mb-8">
            Jawa Tengah
          </h3>
          <p className="text-yellow-400 text-sm md:text-lg mb-8 [text-shadow:_0_0_5px_rgba(250,204,21,0.6)]">
            Design By{" "}
            <span
              className="text-cyan-400 [text-shadow:_0_0_5px_rgba(34,211,238,0.6)]"
              style={{
                fontFamily: "'Special Gothic Expanded One', sans-serif",
              }}
            >
              Mutuharjo Web Dev
            </span>
          </p>

          <button
            className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded hover:bg-yellow-400 hover:text-black transition font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)] hover:shadow-[0_0_15px_rgba(250,204,21,0.8)]"
            style={{ fontFamily: "'Special Gothic Expanded One', sans-serif" }}
          >
            Click Here
          </button>
        </div>
      </div>
    );

  return (
    <main className="p-4 w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        <section className="grid grid-cols-3 gap-4 flex-1">
          {renderParticipant()}
        </section>

        <aside className="w-full lg:w-64 bg-white rounded-xl shadow-md p-4 h-fit">
          <h1 className="text-xl font-bold mb-2 text-black">
            🎯 Round {curRound}
          </h1>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            ⏳ Countdown:
          </h2>
          <p className="text-2xl font-mono text-blue-600">
            {formatTime(timeLeft)}
          </p>
          <p className="mt-2 text-sm text-gray-500 capitalize">
            Status: <strong>{config?.status}</strong>
          </p>
        </aside>
      </div>
    </main>
  );
}

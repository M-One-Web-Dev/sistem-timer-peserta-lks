"use client";

import { useRouter } from "next/navigation";
import { saveToStorage, getFromStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConfigPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [round, setRound] = useState(1);
  const [maxRound, setMaxRound] = useState(3);
  const [countdown, setCountdown] = useState(3600);
  const [participants, setParticipants] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Peserta ${i + 1}`,
    }))
  );

  const [backgrounds, setBackgrounds] = useState({
    prepare: "#facc15", // yellow-400
    active: "#22c55e", // green-500
    rest: "#ef4444", // red-500
    done: "#6b7280", // gray-500
  });

  const [textColors, setTextColors] = useState({
    prepare: "#ffffff",
    active: "#ffffff",
    rest: "#ffffff",
    done: "#ffffff",
  });

  const [status, setStatus] = useState<"paused" | "running" | "stopped">(
    "paused"
  );

  useEffect(() => {
    const saved = getFromStorage();
    if (saved) {
      setRound(saved.currentRound);
      setMaxRound(saved.maxRound ?? 3);
      setCountdown(saved.totalCountdown);
      setParticipants(saved.participants);
      if (saved.backgrounds) setBackgrounds(saved.backgrounds);
      if (saved.textColors) setTextColors(saved.textColors);
      if (saved.status) setStatus(saved.status);
    }
  }, []);

  useEffect(() => {
    if (status !== "paused") {
      // Save status in local storage when it's not paused
      saveToStorage({ status });
    }
  }, [status]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStart = () => {
    const config = {
      participants,
      totalCountdown: countdown,
      currentRound: round,
      currentCountdownStartTime: Date.now(),
      maxRound,
      backgrounds,
      textColors,
      status: "running",
    };
    setStatus("running");

    saveToStorage(config);
    alert("Lomba dimulai!");
    // router.push("/");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePause = () => {
    const config = {
      participants,
      totalCountdown: countdown,
      currentRound: round,
      currentCountdownStartTime: Date.now(),
      maxRound,
      backgrounds,
      textColors,
      status: "paused",
    };
    setStatus("paused");

    saveToStorage(config);
    alert("Lomba di-pause!");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStop = () => {
    const config = {
      participants,
      totalCountdown: countdown,
      currentRound: round,
      currentCountdownStartTime: Date.now(),
      maxRound,
      backgrounds,
      textColors,
      status: "stopped",
    };
    setStatus("stopped");

    saveToStorage(config);
    alert("Lomba di-stop!");
    //  router.push("/");
  };

  const handleSaveConfig = () => {
    const config = {
      participants,
      totalCountdown: countdown,
      currentRound: round,
      currentCountdownStartTime: Date.now(),
      maxRound,
      backgrounds,
      textColors,
      status: "running",
    };
    saveToStorage(config);
    alert("Data berhasil disimpan!");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Konfigurasi Lomba</h1>

      <div>
        <label className="block font-medium">Round Awal</label>
        <input
          type="number"
          value={round}
          onChange={(e) => setRound(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Max Round</label>
        <input
          type="number"
          value={maxRound}
          onChange={(e) => setMaxRound(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Durasi Countdown (detik)</label>
        <input
          type="number"
          value={countdown}
          onChange={(e) => setCountdown(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Daftar Peserta</label>
        <div className="space-y-2">
          {participants?.map((p, i) => (
            <input
              key={p.id}
              type="text"
              value={p.name}
              onChange={(e) => {
                const updated = [...participants];
                updated[i].name = e.target.value;
                setParticipants(updated);
              }}
              className="border px-2 py-1 rounded w-full"
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">Warna Background & Text</h2>
        {Object.keys(backgrounds).map((key) => (
          <div key={key} className="mb-4">
            <label className="block font-semibold capitalize mb-1">
              Status: {key}
            </label>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm">Background</span>
                <input
                  type="color"
                  value={backgrounds[key as keyof typeof backgrounds]}
                  onChange={(e) =>
                    setBackgrounds((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-12 h-8 rounded border"
                />
              </div>
              <div>
                <span className="text-sm">Text</span>
                <input
                  type="color"
                  value={textColors[key as keyof typeof textColors]}
                  onChange={(e) =>
                    setTextColors((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-12 h-8 rounded border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Mulai Lomba
        </button> */}
        {/* <button
          onClick={handlePause}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
        >
          Pause Lomba
        </button>
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Berhenti Lomba
        </button> */}
        <button
          onClick={handleSaveConfig}
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Simpan Data
        </button>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-xl">
          <Link href={"/"} className="">
            Check halaman Timer
          </Link>
        </div>
      </div>
    </div>
  );
}

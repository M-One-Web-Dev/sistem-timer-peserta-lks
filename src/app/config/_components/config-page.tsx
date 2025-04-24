"use client";

import { useRouter } from "next/navigation";
import { saveToStorage, getFromStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConfigPage() {
  const router = useRouter();
  const [round, setRound] = useState(1);
  const [maxRound, setMaxRound] = useState(3);
  const [countdown, setCountdown] = useState(3600);
  const [participants, setParticipants] = useState<
    { id: number; name: string }[]
  >([]);
  const [totalParticipant, setTotalParticipant] = useState(12);

  const [backgrounds, setBackgrounds] = useState({
    prepare: "#facc15",
    active: "#22c55e",
    rest: "#ef4444",
    done: "#6b7280",
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
      if (saved.participants) {
        setParticipants(saved.participants);
        setTotalParticipant(saved.participants.length);
      }
      if (saved.backgrounds) setBackgrounds(saved.backgrounds);
      if (saved.textColors) setTextColors(saved.textColors);
      if (saved.status) setStatus(saved.status);
    }
  }, []);

  useEffect(() => {
    if (status !== "paused") {
      saveToStorage({ status });
    }
  }, [status]);

  // Sync jumlah peserta berdasarkan input totalParticipant
  useEffect(() => {
    if (totalParticipant > participants.length) {
      const diff = totalParticipant - participants.length;
      const newParticipants = Array.from({ length: diff }, (_, i) => ({
        id: Date.now() + i,
        name: `Peserta ${participants.length + i + 1}`,
      }));
      setParticipants((prev) => [...prev, ...newParticipants]);
    } else if (totalParticipant < participants.length) {
      setParticipants((prev) => prev.slice(0, totalParticipant));
    }
  }, [totalParticipant]);

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
          value={round || 0}
          onChange={(e) => setRound(parseInt(e.target.value || "0"))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Max Round</label>
        <input
          type="number"
          value={maxRound || 0}
          onChange={(e) => setMaxRound(parseInt(e.target.value || "0"))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Durasi Countdown (detik)</label>
        <input
          type="number"
          value={countdown || 0}
          onChange={(e) => setCountdown(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Total Peserta</label>
        <input
          type="number"
          min={1}
          value={totalParticipant}
          onChange={(e) =>
            setTotalParticipant(Math.max(1, parseInt(e.target.value || "0")))
          }
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Daftar Peserta</label>
        <div className="space-y-2">
          {participants.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <input
                type="text"
                value={p.name}
                onChange={(e) => {
                  const updated = [...participants];
                  updated[i].name = e.target.value || "";
                  setParticipants(updated);
                }}
                className="border px-2 py-1 rounded w-full"
              />
              <button
                type="button"
                onClick={() => {
                  const filtered = participants.filter((_, idx) => idx !== i);
                  setParticipants(filtered);
                  setTotalParticipant(filtered.length);
                }}
                className="text-red-500 font-bold text-lg"
                title="Hapus Peserta"
              >
                ×
              </button>
            </div>
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
        <button
          onClick={handleSaveConfig}
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Simpan Data
        </button>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-xl">
          <Link href={"/"}>Check halaman Timer</Link>
        </div>
      </div>
    </div>
  );
}

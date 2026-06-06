import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { Info, Volume2, VolumeX, Sparkle, Trash2, Send } from "lucide-react";

// Import new decorative assets
import lily1 from "@/assets/lily1.png";
import lily2 from "@/assets/lily2.png";

export const Route = createFileRoute("/lilies")({
  head: () => ({
    meta: [
      { title: "The Lily Pond ✦ Whimsical Wishes" },
      { name: "description", content: "A tranquil garden of floating lilies, musical chimes, and quiet reflections." },
    ],
  }),
  component: LilyPond,
});

// Sound synthesiser setup
let audioCtx: AudioContext | null = null;
const PENTATONIC_NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50, // C6
  1174.66, // D6
  1318.51, // E6
  1567.98, // G6
  1760.00, // A6
];

function playChime(noteIndex: number, muted: boolean) {
  if (muted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    
    // Create oscillator and gain envelope
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    const baseFreq = PENTATONIC_NOTES[noteIndex % PENTATONIC_NOTES.length];
    osc.frequency.setValueAtTime(baseFreq, now);
    
    // Fast decay envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.005); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.005, now + 1.2); // long decay
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 1.25);
  } catch (e) {
    console.warn("Web Audio API blocked or not supported:", e);
  }
}

function playReleaseSweep(muted: boolean) {
  if (muted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const duration = 1.8;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + duration);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (e) {
    console.warn(e);
  }
}

// Preset affirmations / fortunes
const LILY_AFFIRMATIONS = [
  "Vanya, like a water lily, may you always rise above deep waters and bloom beautifully.",
  "Your spirit is ethereal and starry. Let yourself shine bright this year.",
  "A beautiful new chapter is unfolding for you. Step forward with trust.",
  "May your heart be a garden of soft memories and gentle thoughts.",
  "You make the universe warmer and more magical just by being in it.",
  "May gentle skies, lavender sunsets, and peaceful mornings surround you.",
  "Your dreams are seeds. May this year give them the room to bloom.",
  "Every lily opens in its own sweet time. You are right where you need to be.",
  "May love and laughter follow you into this brand new age.",
  "A secret wish is floating towards you, carried on the wings of a dragonfly.",
];

interface PlacedLily {
  id: string;
  type: string;
  x: number; // percentage
  y: number; // percentage
  rotation: number;
  noteIndex: number;
  isWish?: boolean;
  wishText?: string;
  isReleasing?: boolean;
  color: string;
  glowColor: string;
}

interface WaterRipple {
  id: string;
  x: number;
  y: number;
}

// Custom lily flower renderer
function LilyFlower({ color, glowColor, isWish }: { color: string; glowColor: string; isWish?: boolean }) {
  return (
    <div className="relative w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300">
      <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lily Pad underneath */}
        <path 
          d="M 50,75 C 22,75 15,66 15,55 C 15,44 28,40 50,40 C 72,40 85,44 85,55 C 85,66 78,75 50,75 Z" 
          fill="oklch(0.38 0.1 140)" 
          opacity="0.9" 
        />
        {/* Pad Cutout */}
        <path d="M 50,40 L 53,52 L 47,52 Z" fill="#0d162b" opacity="0.3" />

        {/* Petals Group */}
        <g className="origin-[50px_55px] animate-lily-bloom">
          {/* Outer Petals */}
          <path d="M 50,55 C 22,50 28,22 50,12 C 72,22 78,50 50,55 Z" fill={color} opacity="0.8" />
          <path d="M 50,55 C 22,50 28,22 50,12 C 72,22 78,50 50,55 Z" fill={color} opacity="0.75" transform="rotate(30 50 55)" />
          <path d="M 50,55 C 22,50 28,22 50,12 C 72,22 78,50 50,55 Z" fill={color} opacity="0.75" transform="rotate(-30 50 55)" />
          
          {/* Mid Petals */}
          <path d="M 50,55 C 32,52 36,30 50,18 C 64,30 68,52 50,55 Z" fill={color} opacity="0.9" transform="rotate(15 50 55)" />
          <path d="M 50,55 C 32,52 36,30 50,18 C 64,30 68,52 50,55 Z" fill={color} opacity="0.9" transform="rotate(-15 50 55)" />
          
          {/* Inner Petals */}
          <path d="M 50,55 C 40,53 42,35 50,28 C 58,35 60,53 50,55 Z" fill="#fff" opacity="0.95" />
          
          {/* Heart / Stamen */}
          <circle cx="50" cy="48" r="6" fill={glowColor} className="animate-pulse" />
          <circle cx="47" cy="45" r="1.5" fill="#fef08a" />
          <circle cx="53" cy="45" r="1.5" fill="#fef08a" />
          <circle cx="50" cy="42" r="1.5" fill="#fef08a" />
        </g>
      </svg>
      {isWish && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold animate-ping border border-white" />
      )}
    </div>
  );
}

function LilyPond() {
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"plant" | "wish">("plant");
  
  // Selected lily type for planting
  const [selectedType, setSelectedType] = useState("starry");
  
  // Wish typing state
  const [wishInput, setWishInput] = useState("");
  // Placing wish mode
  const [placingWish, setPlacingWish] = useState(false);
  
  // Selected lily in focus (for displaying reflection)
  const [focusedLily, setFocusedLily] = useState<PlacedLily | null>(null);

  // Placed Lilies
  const [lilies, setLilies] = useState<PlacedLily[]>([
    {
      id: "preset-1",
      type: "starry",
      x: 22,
      y: 35,
      rotation: -10,
      noteIndex: 2,
      color: "oklch(0.7 0.15 300)", // Violet
      glowColor: "oklch(0.85 0.12 85)",
      wishText: "Vanya, like a water lily, may you always rise above deep waters and bloom beautifully.",
    },
    {
      id: "preset-2",
      type: "sunbeam",
      x: 76,
      y: 28,
      rotation: 15,
      noteIndex: 4,
      color: "oklch(0.8 0.15 80)", // Golden
      glowColor: "oklch(0.9 0.15 70)",
      wishText: "May your days be filled with warmth, laughter, and light. Happy 22nd Birthday!",
    },
    {
      id: "preset-3",
      type: "lunar",
      x: 48,
      y: 62,
      rotation: 5,
      noteIndex: 0,
      color: "oklch(0.85 0.08 220)", // Soft Cyan
      glowColor: "oklch(0.95 0.05 320)",
      wishText: "Trust your intuition and let the moon guide your dreams.",
    },
    {
      id: "preset-4",
      type: "enchanted",
      x: 28,
      y: 72,
      rotation: -8,
      noteIndex: 6,
      color: "oklch(0.75 0.14 15)", // Soft Rose
      glowColor: "oklch(0.85 0.12 85)",
      wishText: "May love and softness follow you wherever you wander.",
    },
  ]);

  // Water ripples state
  const [ripples, setRipples] = useState<WaterRipple[]>([]);
  const pondRef = useRef<HTMLDivElement>(null);

  // Lily Types definitions
  const lilyTypes = [
    { id: "starry", name: "Starry Lily", color: "oklch(0.7 0.15 300)", glow: "oklch(0.85 0.12 85)", desc: "Violaceous dreams & midnight thoughts", emoji: "🔮" },
    { id: "sunbeam", name: "Sunbeam Lily", color: "oklch(0.8 0.15 80)", glow: "oklch(0.9 0.15 70)", desc: "Golden joy & warm solar blessings", emoji: "☀️" },
    { id: "lunar", name: "Lunar Lily", color: "oklch(0.85 0.08 220)", glow: "oklch(0.95 0.05 320)", desc: "Cool silver reflection & clear intuition", emoji: "🌙" },
    { id: "enchanted", name: "Enchanted Rose", color: "oklch(0.75 0.14 15)", glow: "oklch(0.85 0.12 85)", desc: "Soft affection & romantic alignment", emoji: "🌸" },
    { id: "lotus", name: "Celestial Lotus", color: "oklch(0.8 0.12 160)", glow: "oklch(0.9 0.08 150)", desc: "Serene waters & quiet deep wisdom", emoji: "🪷" },
  ];

  // Spawn ripples at percentage coordinate
  const triggerRipple = (x: number, y: number) => {
    const newRipple = {
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);
  };

  // Click on pond surface
  const handlePondClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pondRef.current) return;
    const rect = pondRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    triggerRipple(x, y);

    // If placing a wish lily
    if (placingWish && wishInput.trim()) {
      const typeData = lilyTypes[Math.floor(Math.random() * lilyTypes.length)];
      const noteIdx = Math.floor(Math.random() * PENTATONIC_NOTES.length);
      const newLily: PlacedLily = {
        id: Math.random().toString(36).substring(2, 9),
        type: typeData.id,
        x,
        y,
        rotation: Math.random() * 30 - 15,
        noteIndex: noteIdx,
        isWish: true,
        wishText: wishInput.trim(),
        color: typeData.color,
        glowColor: typeData.glow,
      };

      setLilies((prev) => [...prev, newLily]);
      setFocusedLily(newLily);
      playChime(noteIdx, muted);
      
      // Reset wish form
      setWishInput("");
      setPlacingWish(false);
      
      // Confetti trigger
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
      }
      return;
    }

    // Otherwise, plant a regular lily
    const typeDef = lilyTypes.find((t) => t.id === selectedType) || lilyTypes[0];
    const randNote = Math.floor(Math.random() * PENTATONIC_NOTES.length);
    const randAffirmation = LILY_AFFIRMATIONS[Math.floor(Math.random() * LILY_AFFIRMATIONS.length)];
    
    const newLily: PlacedLily = {
      id: Math.random().toString(36).substring(2, 9),
      type: selectedType,
      x,
      y,
      rotation: Math.random() * 30 - 15,
      noteIndex: randNote,
      wishText: randAffirmation,
      color: typeDef.color,
      glowColor: typeDef.glow,
    };

    setLilies((prev) => [...prev, newLily]);
    setFocusedLily(newLily);
    playChime(randNote, muted);
  };

  // Click on a placed Lily
  const handleLilyClick = (e: React.MouseEvent, lily: PlacedLily) => {
    e.stopPropagation(); // Avoid double click on pond
    triggerRipple(lily.x, lily.y);
    setFocusedLily(lily);
    playChime(lily.noteIndex, muted);
  };

  // Submit wish text to prepare planting
  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    setPlacingWish(true);
  };

  // Release a wish lily to dissolve into sparkles
  const releaseWish = (lilyId: string) => {
    playReleaseSweep(muted);

    // Trigger visual dissolve class
    setLilies((prev) =>
      prev.map((l) => (l.id === lilyId ? { ...l, isReleasing: true } : l))
    );

    // Delete from state after animation completes
    setTimeout(() => {
      setLilies((prev) => prev.filter((l) => l.id !== lilyId));
      if (focusedLily?.id === lilyId) {
        setFocusedLily(null);
      }
    }, 1800);
  };

  // Pre-placed lily pads sways
  const lilyPads = [
    { x: 10, y: 55, r: 24, scale: 0.8 },
    { x: 85, y: 70, r: 28, scale: 1.1 },
    { x: 45, y: 15, r: 35, scale: 0.9 },
    { x: 60, y: 45, r: 20, scale: 0.7 },
  ];

  return (
    <section className="relative bg-twilight text-white py-16 overflow-hidden min-h-screen">
      {/* Background Gradient - locks to dark theme for night pond vibes */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#110e24] via-[#151230] to-[#0c091f] -z-10" aria-hidden />
      <Sparkles count={25} />

      {/* Floating Decorative Lily Corner Assets — z-10 so they sit above the bg gradient */}
      <div className="absolute -left-8 bottom-8 w-44 sm:w-60 md:w-72 pointer-events-none opacity-55 md:opacity-70 animate-float z-[1] select-none drop-shadow-2xl">
        <img src={lily1} alt="Lily decoration left" className="w-full h-auto object-contain" style={{ filter: "drop-shadow(0 0 24px oklch(0.75 0.14 300 / 0.5))" }} />
      </div>
      <div className="absolute -right-10 top-20 w-44 sm:w-60 md:w-72 pointer-events-none opacity-55 md:opacity-70 animate-float z-[1] select-none drop-shadow-2xl" style={{ animationDelay: "2.5s" }}>
        <img src={lily2} alt="Lily decoration right" className="w-full h-auto object-contain" style={{ filter: "drop-shadow(0 0 24px oklch(0.82 0.12 85 / 0.5))" }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 space-y-10">
        
        {/* Header */}
        <Reveal className="text-center space-y-3 relative">
          <p className="font-script text-3xl text-gold">a serene water sanctuary</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance text-white">
            The Lily Pond
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto italic text-sm sm:text-base">
            Plant floating flowers, listen to the chime-harp of the waters, or leave a silent wish to float under the purple stars.
          </p>

          {/* Sound Controls */}
          <div className="absolute top-0 right-0 z-20">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gold flex items-center justify-center cursor-pointer"
              title={muted ? "Unmute chimes" : "Mute chimes"}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </Reveal>

        {/* MAIN INTERACTIVE POND CONTAINER */}
        <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* LEFT: POND VIEW (Col 8) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            {placingWish && (
              <div className="mb-4 text-center px-4 py-2 bg-gold/15 border border-gold/40 rounded-full text-gold text-xs sm:text-sm animate-pulse tracking-wide font-medium">
                ✦ Tap anywhere on the water surface to float your Wish Lily! ✦
              </div>
            )}

            <div
              ref={pondRef}
              onClick={handlePondClick}
              className="relative w-full aspect-[1.4] sm:aspect-[1.5] rounded-[2rem] border-4 border-gold/30 shadow-glow overflow-hidden cursor-crosshair bg-gradient-to-b from-[#0b081a] via-[#100d2b] to-[#070514] select-none"
            >
              {/* Soft water shine gradient overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(196,181,253,0.06),transparent_60%)]" />
              
              {/* Swaying Lily Pads (Atmosphere) */}
              {lilyPads.map((pad, idx) => (
                <div
                  key={idx}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${pad.x}%`,
                    top: `${pad.y}%`,
                    transform: `scale(${pad.scale})`,
                    animation: `lily-sway ${8 + idx * 2}s ease-in-out infinite`,
                    animationDelay: `${idx * 1.2}s`
                  }}
                >
                  <svg className="w-14 h-14 opacity-35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M 50,75 C 22,75 15,66 15,55 C 15,44 28,40 50,40 C 72,40 85,44 85,55 C 85,66 78,75 50,75 Z" 
                      fill="oklch(0.35 0.08 140)" 
                    />
                    <path d="M 50,40 L 52,50 L 48,50 Z" fill="#060913" opacity="0.4" />
                  </svg>
                </div>
              ))}

              {/* Water Ripples */}
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="absolute animate-ripple rounded-full border border-white/30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${ripple.x}%`,
                    top: `${ripple.y}%`,
                    width: "80px",
                    height: "80px",
                  }}
                />
              ))}

              {/* Placed Lilies */}
              {lilies.map((lily) => (
                <button
                  key={lily.id}
                  onClick={(e) => handleLilyClick(e, lily)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group outline-none hover:scale-105 active:scale-95 transition-all duration-300 ${
                    lily.isReleasing ? "animate-dissolve-up pointer-events-none" : "animate-lily-sway"
                  }`}
                  style={{
                    left: `${lily.x}%`,
                    top: `${lily.y}%`,
                    animationDelay: `${lily.rotation * 0.15}s`,
                    transform: `rotate(${lily.rotation}deg)`,
                  }}
                >
                  {/* Lily SVG */}
                  <LilyFlower color={lily.color} glowColor={lily.glowColor} isWish={lily.isWish} />

                  {/* Pulsing glow ring around wish lily */}
                  {lily.isWish && (
                    <div 
                      className="absolute -inset-2 rounded-full pointer-events-none opacity-40 blur-md animate-pulse"
                      style={{ background: `radial-gradient(circle, ${lily.glowColor} 0%, transparent 70%)` }}
                    />
                  )}
                </button>
              ))}

              {/* Decorative instructions on the water */}
              {lilies.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none text-center">
                  <p className="text-white/20 font-display italic text-lg sm:text-2xl">
                    The waters are quiet.<br />Plant a lily to begin.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-white/40 mt-3 flex items-center gap-1.5 justify-center tracking-widest uppercase select-none">
              <Info className="w-3.5 h-3.5" /> Tap lilies to play their chord & see their message
            </p>
          </div>

          {/* RIGHT: TOOLBOX / REFLECTIONS (Col 4) - explicitly dark backgrounds to solve light-mode whiteout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TABS SWITCHER */}
            <div className="flex rounded-full bg-black/40 border border-white/10 p-1">
              <button
                onClick={() => {
                  setActiveTab("plant");
                  setPlacingWish(false);
                }}
                className={`flex-1 py-2 text-center rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === "plant"
                    ? "bg-gold text-[#0c091f] shadow-soft"
                    : "text-white/60 hover:text-white"
                }`}
              >
                🌱 Plant Lily
              </button>
              <button
                onClick={() => {
                  setActiveTab("wish");
                }}
                className={`flex-1 py-2 text-center rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === "wish"
                    ? "bg-gold text-[#0c091f] shadow-soft"
                    : "text-white/60 hover:text-white"
                }`}
              >
                💌 Float Wish
              </button>
            </div>

            {/* TAB CONTENT: PLANT TOOLBOX - explicitly styled dark glassmorphic card for light-mode visibility */}
            {activeTab === "plant" && (
              <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4 animate-fade-up">
                <h3 className="font-display text-2xl text-gold">Choose Flower</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Select a species of Lily. When you tap on the water, that flower will take root, bloom, and play a special chord chime.
                </p>

                <div className="space-y-3">
                  {lilyTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group cursor-pointer ${
                        selectedType === t.id
                          ? "bg-white/10 border-gold/60 text-white shadow-soft"
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/8 hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{t.name}</p>
                        <p className="text-[10px] text-white/40 truncate">{t.desc}</p>
                      </div>
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center p-0.5"
                        style={{ borderColor: selectedType === t.id ? "var(--color-gold)" : "" }}
                      >
                        {selectedType === t.id && <div className="w-full h-full rounded-full bg-gold" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FLOAT WISH - explicitly styled dark glassmorphic card for light-mode visibility */}
            {activeTab === "wish" && (
              <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4 animate-fade-up">
                <h3 className="font-display text-2xl text-gold">Floating Wishes</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Write a birthday wish, secret hope, or lovely thought. Float it as a glowing lily to keep company on the water.
                </p>

                <form onSubmit={handleWishSubmit} className="space-y-4 pt-2">
                  <textarea
                    value={wishInput}
                    onChange={(e) => setWishInput(e.target.value)}
                    placeholder="Write a sweet wish to Vanya..."
                    maxLength={150}
                    className="w-full h-24 p-3 rounded-2xl bg-black/40 border border-white/10 focus:border-gold/60 focus:ring-1 focus:ring-gold/20 outline-none text-sm placeholder:text-white/30 text-white resize-none transition-all"
                  />
                  <div className="flex justify-between items-center text-[10px] text-white/40 px-1">
                    <span>Max 150 chars</span>
                    <span>{wishInput.length}/150</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!wishInput.trim() || placingWish}
                    className="w-full py-3 rounded-full bg-gold text-[#0c091f] text-xs font-semibold hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-soft disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {placingWish ? "Ready to Plant ✦" : "Float on Pond"}
                  </button>
                </form>
              </div>
            )}

            {/* REFLECTION DISPLAY BOARD - explicitly styled dark glassmorphic card for light-mode visibility */}
            <div className="min-h-[140px]">
              {focusedLily ? (
                <div className="bg-slate-950/75 border-2 border-gold/40 rounded-3xl p-6 backdrop-blur-xl space-y-4 animate-fade-up relative overflow-hidden">
                  <div 
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full pointer-events-none opacity-20 blur-xl"
                    style={{ background: focusedLily.color }}
                  />

                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-[10px] uppercase tracking-wider text-gold font-semibold">
                      {focusedLily.isWish ? "✦ Floating Wish" : "✿ Lily Reflection"}
                    </span>
                    
                    {/* Release wish button */}
                    {focusedLily.isWish && !focusedLily.isReleasing && (
                      <button
                        onClick={() => releaseWish(focusedLily.id)}
                        className="text-white/55 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] font-semibold border border-white/10 hover:border-red-400/30 px-2.5 py-0.5 rounded-full cursor-pointer"
                        title="Release wish to the heavens"
                      >
                        <Trash2 className="w-3 h-3" /> Release
                      </button>
                    )}
                  </div>

                  <p className="font-display italic text-lg sm:text-xl text-white leading-relaxed">
                    "{focusedLily.wishText}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/10">
                    <span className="capitalize">{focusedLily.type} Lily</span>
                    <span>Chord note: {focusedLily.noteIndex + 1}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full border border-dashed border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center text-white/30 italic text-sm">
                  <Sparkle className="w-5 h-5 mb-2 text-gold animate-pulse" />
                  Tap any blooming flower in the pond to reveal its mystical message
                </div>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM: LILY GALLERY SHOWCASE */}
        <Reveal className="relative z-10">
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="group relative rounded-3xl overflow-hidden border-2 border-gold/30 shadow-glow">
              <img src={lily1} alt="Lily I" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-0 right-0 text-center font-script text-lg text-gold">Water Lily I</p>
            </div>
            <div className="group relative rounded-3xl overflow-hidden border-2 border-primary/30 shadow-glow">
              <img src={lily2} alt="Lily II" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-0 right-0 text-center font-script text-lg text-gold">Water Lily II</p>
            </div>
          </div>
        </Reveal>

        {/* BOTTOM: PRESETS POETIC TRIBUTE */}
        <Reveal className="text-center pt-4 border-t border-white/10 space-y-3 relative z-10">
          <p className="font-display italic text-2xl md:text-3xl text-gold/80 text-balance max-w-2xl mx-auto">
            "May the ripples of your joy expand into the universe, echoing with sweetness."
          </p>
          <p className="text-white/30 text-sm font-script text-lg">
            happy birthday, fairy of the waters
          </p>
        </Reveal>

      </div>

      {/* STYLES block for custom keyframes */}
      <style>{`
        @keyframes ripple {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(0.15);
            opacity: 0.9;
            border-width: 4px;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) scale(3.5);
            opacity: 0;
            border-width: 0.5px;
          }
        }
        
        .animate-ripple {
          animation: ripple 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes lily-bloom {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          65% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }

        .animate-lily-bloom {
          animation: lily-bloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes lily-sway {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-2px, -4px, 0) rotate(3deg);
          }
        }

        .animate-lily-sway {
          animation: lily-sway 7s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes dissolve-up {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          30% {
            transform: translate3d(-50%, -60%, 0) scale(1.1);
            opacity: 0.9;
            filter: blur(1px);
          }
          100% {
            transform: translate3d(-50%, -160%, 0) scale(0.1);
            opacity: 0;
            filter: blur(6px);
          }
        }

        .animate-dissolve-up {
          animation: dissolve-up 1.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
}

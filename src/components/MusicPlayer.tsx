import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, X, Music, RotateCcw } from "lucide-react";

// @ts-ignore
import kissOfLifeUrl from "@/assets/kiss of life.mp3";
// @ts-ignore
import reflectionsUrl from "@/assets/reflections.mp3";
// @ts-ignore
import thoseEyesUrl from "@/assets/those eyes.mp3";

const STORAGE_KEY_VIBE = "vanya-music-vibe";
const STORAGE_KEY_VOL = "vanya-music-volume";

type VibeType = "chimes" | "forest" | "sade" | "reflections" | "those-eyes";

interface VibeController {
  stop: () => void;
}

const VIBES = [
  { id: "chimes", name: "Dreamy Chimes", emoji: "🌌", color: "from-blue-600/30 to-indigo-700/30" },
  { id: "forest", name: "Enchanted Forest", emoji: "🧚", color: "from-emerald-600/30 to-teal-700/30" },
  { id: "sade", name: "Kiss of Life", emoji: "🎷", color: "from-rose-600/30 to-purple-700/30" },
  { id: "reflections", name: "Reflections", emoji: "✨", color: "from-amber-500/30 to-orange-700/30" },
  { id: "those-eyes", name: "Those Eyes", emoji: "👁️", color: "from-fuchsia-600/30 to-pink-700/30" },
];

/**
 * Creates a synthesized background track using Web Audio API for the procedural vibes
 */
function playSynthVibe(ctx: AudioContext, destination: AudioNode, vibe: Exclude<VibeType, "sade" | "reflections" | "those-eyes">): VibeController {
  const intervals: ReturnType<typeof setInterval>[] = [];
  const activeGains: GainNode[] = [];

  const registerGain = (g: GainNode) => {
    activeGains.push(g);
  };

  const playNote = (
    frequency: number,
    type: OscillatorType,
    attack: number,
    decay: number,
    sustain: number,
    release: number,
    peakGain: number
  ) => {
    if (ctx.state === "closed") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + attack);

    const totalDuration = attack + decay + release;
    gain.gain.setValueAtTime(peakGain, ctx.currentTime + attack + decay);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + totalDuration);

    osc.connect(gain);
    gain.connect(destination);

    registerGain(gain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + totalDuration + 0.1);
  };

  if (vibe === "chimes") {
    // Soft constant pad
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = "sine";
    padOsc.frequency.value = 261.63; // C4
    padGain.gain.setValueAtTime(0, ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);
    padOsc.connect(padGain);
    padGain.connect(destination);

    registerGain(padGain);
    padOsc.start(ctx.currentTime);

    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    const trigger = () => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      playNote(note, "sine", 0.3, 0.2, 0.8, 2.2, 0.15);
    };

    trigger();
    const interval = setInterval(trigger, 2200);
    intervals.push(interval);

    return {
      stop: () => {
        intervals.forEach(clearInterval);
        activeGains.forEach((g) => {
          try {
            g.gain.cancelScheduledValues(ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          } catch {}
        });
        try {
          padOsc.stop(ctx.currentTime + 0.4);
        } catch {}
      },
    };
  } else {
    // forest
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = "sine";
    padOsc.frequency.value = 369.99; // F#4
    padGain.gain.setValueAtTime(0, ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.0);
    padOsc.connect(padGain);
    padGain.connect(destination);

    registerGain(padGain);
    padOsc.start(ctx.currentTime);

    const notes = [185.0, 207.65, 233.08, 277.18, 311.13, 369.99, 415.3, 466.16];
    const triggerMelody = () => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      playNote(note, "triangle", 0.4, 0.3, 0.7, 1.2, 0.14);
    };

    triggerMelody();
    const intervalMelody = setInterval(triggerMelody, 1600);
    intervals.push(intervalMelody);

    const sparkleNotes = [987.77, 1108.73, 1318.51, 1479.98, 1661.22, 1975.53];
    const triggerSparkles = () => {
      if (Math.random() > 0.65) {
        const note = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
        playNote(note, "sine", 0.02, 0.05, 0.1, 0.15, 0.06);
      }
    };
    const intervalSparkles = setInterval(triggerSparkles, 600);
    intervals.push(intervalSparkles);

    return {
      stop: () => {
        intervals.forEach(clearInterval);
        activeGains.forEach((g) => {
          try {
            g.gain.cancelScheduledValues(ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          } catch {}
        });
        try {
          padOsc.stop(ctx.currentTime + 0.4);
        } catch {}
      },
    };
  }
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(25); // default 25% (clear but comfortable)
  const [vibe, setVibe] = useState<VibeType>("chimes");
  const [showSettings, setShowSettings] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const vibeControllerRef = useRef<VibeController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedVibe = localStorage.getItem(STORAGE_KEY_VIBE) as VibeType;
    if (savedVibe && ["chimes", "forest", "sade", "reflections", "those-eyes"].includes(savedVibe)) {
      setVibe(savedVibe);
    }

    const savedVolume = localStorage.getItem(STORAGE_KEY_VOL);
    if (savedVolume) {
      const volNum = parseInt(savedVolume, 10);
      if (!isNaN(volNum) && volNum >= 0 && volNum <= 100) {
        setVolume(volNum);
      }
    }
  }, []);

  // Close settings panel when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showSettings]);

  const startPlaying = (selectedVibe: VibeType, targetVolume: number) => {
    stopPlaying();

    if (selectedVibe === "sade" || selectedVibe === "reflections" || selectedVibe === "those-eyes") {
      const url = selectedVibe === "sade" ? kissOfLifeUrl : selectedVibe === "reflections" ? reflectionsUrl : thoseEyesUrl;
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = (targetVolume / 100) * 0.8;
      audioRef.current = audio;

      audio.play().catch((err) => {
        console.warn("Autoplay blocked or audio error:", err);
      });

      vibeControllerRef.current = {
        stop: () => {
          audio.pause();
          audioRef.current = null;
        },
      };
      setPlaying(true);
    } else {
      // Synth vibes
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      ctxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime((targetVolume / 100) * 0.8, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const controller = playSynthVibe(ctx, masterGain, selectedVibe);
      vibeControllerRef.current = controller;
      setPlaying(true);
    }
  };

  const stopPlaying = () => {
    vibeControllerRef.current?.stop();
    vibeControllerRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      ctxRef.current?.close();
    } catch {}
    ctxRef.current = null;
    masterGainRef.current = null;
    setPlaying(false);
  };

  const togglePlay = () => {
    if (playing) {
      stopPlaying();
    } else {
      startPlaying(vibe, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem(STORAGE_KEY_VOL, String(newVol));

    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime((newVol / 100) * 0.8, ctxRef.current.currentTime);
    }

    if (audioRef.current) {
      audioRef.current.volume = (newVol / 100) * 0.8;
    }
  };

  const handleVibeChange = (newVibe: VibeType) => {
    setVibe(newVibe);
    localStorage.setItem(STORAGE_KEY_VIBE, newVibe);
    if (playing) {
      startPlaying(newVibe, volume);
    }
  };

  useEffect(() => {
    return () => {
      vibeControllerRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      try {
        ctxRef.current?.close();
      } catch {}
    };
  }, []);

  const currentVibe = VIBES.find((v) => v.id === vibe) || VIBES[0];

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-body select-none"
    >
      {/* Retro Cassette settings popover */}
      {showSettings && (
        <div className="w-[340px] bg-card/95 backdrop-blur-xl border-2 border-primary/20 rounded-[2rem] p-5 shadow-glow animate-slide-up flex flex-col gap-4 text-foreground">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-twinkle" />
              <h3 className="font-display text-lg font-medium text-primary">Vintage Cassette Deck</h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CASSETTE TAPE CONTAINER */}
          <div className="relative w-full aspect-[1.6/1] bg-neutral-900 border-[6px] border-neutral-800 rounded-2xl p-3 shadow-inner flex flex-col justify-between overflow-hidden">
            {/* Cassette texture sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

            {/* Top Label */}
            <div className="flex justify-between items-center text-[8px] font-bold text-neutral-400 tracking-wider">
              <span>SIDE A</span>
              <span>STEREO</span>
            </div>

            {/* The Sticker Label */}
            <div className={`flex-1 bg-gradient-to-r ${currentVibe.color} border-2 border-neutral-700 rounded-lg p-2.5 flex flex-col justify-between relative`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/95">Vanya's Mix ♊</span>
                <span className="text-[9px] font-semibold text-white/60">Vol. 22</span>
              </div>

              {/* Title tape */}
              <div className="bg-white/90 rounded border border-neutral-400 px-2 py-0.5 mt-1">
                <p className="font-script text-[13px] text-neutral-800 font-bold leading-none py-0.5 truncate text-center">
                  {currentVibe.name}
                </p>
              </div>

              {/* The spindles & window */}
              <div className="flex justify-center items-center gap-8 mt-2">
                {/* Left Spindle */}
                <div className={`w-8 h-8 rounded-full bg-neutral-800 border-4 border-neutral-700 flex items-center justify-center relative ${playing ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }}>
                  <div className="w-3 h-3 bg-neutral-900 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-sm" />
                  </div>
                  {/* Spindle teeth details */}
                  <div className="absolute inset-0.5 border border-dashed border-neutral-500 rounded-full pointer-events-none opacity-40" />
                </div>

                {/* Center Glass Window */}
                <div className="w-16 h-6 bg-neutral-950/80 rounded-md border-2 border-neutral-800 relative overflow-hidden flex items-center justify-center">
                  <div className="w-12 h-[1px] bg-red-600/40" />
                  <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-neutral-800" />
                  {/* Tape roll visual */}
                  <div className="absolute left-2 w-4 h-4 rounded-full bg-amber-950/60 border border-amber-900" />
                  <div className="absolute right-2 w-4 h-4 rounded-full bg-amber-950/60 border border-amber-900" />
                </div>

                {/* Right Spindle */}
                <div className={`w-8 h-8 rounded-full bg-neutral-800 border-4 border-neutral-700 flex items-center justify-center relative ${playing ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }}>
                  <div className="w-3 h-3 bg-neutral-900 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-sm" />
                  </div>
                  {/* Spindle teeth details */}
                  <div className="absolute inset-0.5 border border-dashed border-neutral-500 rounded-full pointer-events-none opacity-40" />
                </div>
              </div>
            </div>

            {/* Bottom tape shell holes */}
            <div className="flex justify-center gap-6 mt-1 text-[8px] text-neutral-500 font-bold">
              <span>NR</span>
              <span>120μs</span>
              <span>CrO2</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Deck Output Volume</span>
              <span>{volume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVolumeChange(volume === 0 ? 25 : 0)}
                className="text-primary hover:scale-110 transition-transform p-1 rounded hover:bg-muted cursor-pointer"
              >
                {volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${volume}%, var(--color-muted) ${volume}%)`,
                }}
              />
            </div>
          </div>

          {/* Vibe Selection Tape Rack */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium">Select Cassette Tape</span>
            <div className="grid grid-cols-2 gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVibeChange(v.id as VibeType)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    vibe === v.id
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-background/40 border-border/40 hover:bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-lg">{v.emoji}</span>
                  <span className="text-[10px] font-semibold truncate leading-none">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Control Capsule */}
      <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur border border-border/50 p-1.5 rounded-full shadow-soft hover:shadow-glow transition-all duration-300">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 cursor-pointer text-primary"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? (
            <div className="flex items-end gap-[3px] h-4">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[2.5px] bg-primary rounded-full"
                  style={{
                    animation: `music-wave 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                    height: "4px",
                  }}
                />
              ))}
            </div>
          ) : (
            <Play className="w-4 h-4 fill-primary text-primary" />
          )}
        </button>

        <span className="w-[1px] h-5 bg-border/40" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            showSettings
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-primary hover:bg-muted"
          }`}
          title="Tape deck settings"
        >
          <Music className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}

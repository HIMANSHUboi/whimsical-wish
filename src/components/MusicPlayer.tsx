import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Sliders, X, Sparkles } from "lucide-react";

// @ts-ignore
import kissOfLifeUrl from "@/assets/kiss of life.mp3";
// @ts-ignore
import reflectionsUrl from "@/assets/reflections.mp3";

const STORAGE_KEY_VIBE = "vanya-music-vibe";
const STORAGE_KEY_VOL = "vanya-music-volume";

type VibeType = "chimes" | "musicbox" | "cosmic" | "forest" | "sade" | "reflections";

interface VibeController {
  stop: () => void;
}

const VIBES = [
  { id: "chimes", name: "Dreamy Chimes", emoji: "🌌" },
  { id: "musicbox", name: "Music Box", emoji: "🧸" },
  { id: "cosmic", name: "Cosmic Lullaby", emoji: "🪐" },
  { id: "forest", name: "Enchanted Forest", emoji: "🧚" },
  { id: "sade", name: "Kiss of Life", emoji: "🎷" },
  { id: "reflections", name: "Reflections", emoji: "✨" },
];

/**
 * Creates a synthesized background track using Web Audio API for the procedural vibes
 */
function playSynthVibe(ctx: AudioContext, destination: AudioNode, vibe: Exclude<VibeType, "sade" | "reflections">): VibeController {
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
  } else if (vibe === "musicbox") {
    // Delay feedback loop for resonance
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.35;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(destination);

    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

    const trigger = () => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      if (ctx.state === "closed") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = note;

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(destination);
      gain.connect(delay);

      registerGain(gain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.4);
    };

    trigger();
    const interval = setInterval(trigger, 850);
    intervals.push(interval);

    return {
      stop: () => {
        intervals.forEach(clearInterval);
        activeGains.forEach((g) => {
          try {
            g.gain.cancelScheduledValues(ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
          } catch {}
        });
      },
    };
  } else if (vibe === "cosmic") {
    // Slow space sweeps & low detuned pads
    const pad1 = ctx.createOscillator();
    const pad2 = ctx.createOscillator();
    const padGain1 = ctx.createGain();
    const padGain2 = ctx.createGain();

    pad1.type = "triangle";
    pad1.frequency.value = 130.81; // C3
    pad2.type = "sine";
    pad2.frequency.value = 131.2; // slightly detuned C3

    padGain1.gain.setValueAtTime(0, ctx.currentTime);
    padGain1.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.5);
    padGain2.gain.setValueAtTime(0, ctx.currentTime);
    padGain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;

    pad1.connect(padGain1);
    pad2.connect(padGain2);
    padGain1.connect(filter);
    padGain2.connect(filter);
    filter.connect(destination);

    registerGain(padGain1);
    registerGain(padGain2);

    pad1.start(ctx.currentTime);
    pad2.start(ctx.currentTime);

    const notes = [130.81, 164.81, 196.0, 246.94, 261.63, 329.63, 392.0, 493.88];
    const trigger = () => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      playNote(note, "triangle", 1.2, 0.5, 0.6, 2.5, 0.12);
    };

    trigger();
    const interval = setInterval(trigger, 3200);
    intervals.push(interval);

    return {
      stop: () => {
        intervals.forEach(clearInterval);
        activeGains.forEach((g) => {
          try {
            g.gain.cancelScheduledValues(ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
          } catch {}
        });
        try {
          pad1.stop(ctx.currentTime + 0.6);
          pad2.stop(ctx.currentTime + 0.6);
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
    if (savedVibe && ["chimes", "musicbox", "cosmic", "forest", "sade", "reflections"].includes(savedVibe)) {
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

    if (selectedVibe === "sade" || selectedVibe === "reflections") {
      const url = selectedVibe === "sade" ? kissOfLifeUrl : reflectionsUrl;
      const audio = new Audio(url);
      audio.loop = true;
      // Scale standard volume. Max 100% maps to gain value of 0.8 to avoid distortion
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

    // Update synth volume in real-time
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime((newVol / 100) * 0.8, ctxRef.current.currentTime);
    }

    // Update MP3 volume in real-time
    if (audioRef.current) {
      audioRef.current.volume = (newVol / 100) * 0.8;
    }
  };

  const handleVibeChange = (newVibe: VibeType) => {
    setVibe(newVibe);
    localStorage.setItem(STORAGE_KEY_VIBE, newVibe);
    if (playing) {
      // Re-trigger playback immediately with the new vibe/track
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

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-body select-none"
    >
      {/* Settings Popover */}
      {showSettings && (
        <div className="w-76 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-soft animate-slide-up flex flex-col gap-4 text-foreground">
          <div className="flex items-center justify-between border-b border-border/30 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-twinkle" />
              <h3 className="font-display text-lg font-medium text-primary">Celestial Vibes</h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Vibe Volume</span>
              <span>{volume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVolumeChange(volume === 0 ? 25 : 0)}
                className="text-primary hover:scale-110 transition-transform p-1 rounded hover:bg-muted cursor-pointer"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
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

          {/* Vibe Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium">Choose Ambient Melody</span>
            <div className="grid grid-cols-2 gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVibeChange(v.id as VibeType)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    vibe === v.id
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-background/40 border-border/40 hover:bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-xl">{v.emoji}</span>
                  <span className="text-[11px] font-semibold leading-none">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Control Capsule */}
      <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur border border-border/50 p-1.5 rounded-full shadow-soft hover:shadow-glow transition-all duration-300">
        {/* Main Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 cursor-pointer text-primary"
          aria-label={playing ? "Pause music" : "Play music"}
          title={playing ? "Pause vibes" : "Play magic ✦"}
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
            <Play className="w-4 h-4 fill-primary" />
          )}
        </button>

        {/* Separator */}
        <span className="w-[1px] h-5 bg-border/40" />

        {/* Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            showSettings
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-primary hover:bg-muted"
          }`}
          title="Configure vibes"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

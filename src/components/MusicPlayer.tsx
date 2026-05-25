import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "vanya-music-on";

/** Creates a gentle, dreamy synthesized loop using Web Audio API */
function createMelody(ctx: AudioContext): { start: () => void; stop: () => void } {
  // Pentatonic notes for a soothing dreamy melody
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentOsc: OscillatorNode | null = null;
  let currentGain: GainNode | null = null;

  const master = ctx.createGain();
  master.gain.value = 0.06;
  master.connect(ctx.destination);

  // Soft pad background
  const padOsc = ctx.createOscillator();
  const padGain = ctx.createGain();
  padOsc.type = "sine";
  padOsc.frequency.value = 261.63;
  padGain.gain.value = 0;
  padOsc.connect(padGain);
  padGain.connect(master);

  const playNote = () => {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = note;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
    osc.connect(gain);
    gain.connect(master);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2.5);
    currentOsc = osc;
    currentGain = gain;
  };

  return {
    start: () => {
      padOsc.start();
      padGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);
      playNote();
      intervalId = setInterval(playNote, 2200);
    },
    stop: () => {
      if (intervalId) clearInterval(intervalId);
      padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      try { padOsc.stop(ctx.currentTime + 0.6); } catch {}
      if (currentGain) currentGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    },
  };
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const melodyRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "1") {
      // Auto-play not possible without user interaction, so we just show the button
    }
  }, []);

  const toggle = () => {
    if (playing) {
      melodyRef.current?.stop();
      ctxRef.current?.close();
      ctxRef.current = null;
      melodyRef.current = null;
      setPlaying(false);
      sessionStorage.setItem(STORAGE_KEY, "0");
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const melody = createMelody(ctx);
      melodyRef.current = melody;
      melody.start();
      setPlaying(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  useEffect(() => {
    return () => {
      melodyRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-card/90 backdrop-blur border border-border/50 shadow-soft flex items-center justify-center gap-[2px] hover:scale-110 transition-all duration-300 group"
      aria-label={playing ? "Mute music" : "Play music"}
      title={playing ? "Mute the vibes" : "Play some magic ✦"}
    >
      {playing ? (
        <div className="flex items-end gap-[3px] h-5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] bg-primary rounded-full"
              style={{
                animation: `music-wave 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
                height: "4px",
              }}
            />
          ))}
        </div>
      ) : (
        <span className="text-primary text-lg group-hover:scale-110 transition-transform">
          ♪
        </span>
      )}
    </button>
  );
}

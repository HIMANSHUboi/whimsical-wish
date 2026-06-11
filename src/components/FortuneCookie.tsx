import { useState, useCallback } from "react";

const FORTUNES = [
  "A beautiful surprise is heading your way this week. Stay open. 🌸",
  "The universe is rearranging itself to give you exactly what you need. ✦",
  "Someone is thinking of you right now with the softest heart. ♡",
  "Your next cup of matcha will taste like pure magic. 🍵",
  "A forgotten dream is about to come true — be ready. 🌙",
  "The stars say: you deserve every good thing. Believe it. ⭐",
  "Something you lost will find its way back to you soon. ✧",
  "Your energy today is golden. People feel it when you walk in. ☀",
  "A tiny act of kindness you did is rippling through the universe right now. 🪷",
  "The moon is winking at you tonight. Look up. ☾",
  "You are someone's favourite person. Yes, really. 💛",
  "Trust the timing. What's meant for you is on its way. ✦",
  "Your next adventure starts on a random Tuesday. Pack light. 🌍",
  "A song you haven't heard yet is about to become your anthem. 🎵",
  "Lavender skies are reserved for people like you — soft, rare, unforgettable. 💜",
  "The best plot twist of your story hasn't happened yet. Stay curious. 📖",
  "You will laugh so hard this month that your stomach will hurt (in the best way). 😂",
  "A Gemini's duality is her superpower. You contain multitudes. ♊",
  "Someone will tell you something this week that makes your whole heart glow. ✨",
  "The tarot cards say: abundance is your birthright. Claim it. 🃏",
  "Your plushies are proud of you. Hirono especially. 🧸",
  "Twenty-two is your golden year. Everything aligns from here. 🌻",
];

export function FortuneCookie() {
  const [isOpen, setIsOpen] = useState(false);
  const [cracked, setCracked] = useState(false);
  const [fortune, setFortune] = useState("");
  const [animating, setAnimating] = useState(false);

  const crackCookie = useCallback(() => {
    if (cracked || animating) return;
    setAnimating(true);
    
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    
    setTimeout(() => {
      setCracked(true);
      setFortune(randomFortune);
      setAnimating(false);
    }, 600);
  }, [cracked, animating]);

  const reset = () => {
    setCracked(false);
    setFortune("");
    setAnimating(false);
  };

  const closeCookie = () => {
    setIsOpen(false);
    // Reset after close animation
    setTimeout(reset, 300);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-card/90 backdrop-blur border border-border/50 shadow-soft hover:shadow-glow hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl cursor-pointer group"
        title="Open a fortune cookie 🥠"
        aria-label="Fortune Cookie"
      >
        <span className="group-hover:rotate-12 transition-transform duration-300">🥠</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeCookie}
      />

      {/* Cookie Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm animate-slide-up">
          <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/20 rounded-[2rem] p-8 shadow-glow text-center space-y-6">
            
            {/* Cookie Visual */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              {!cracked ? (
                <button
                  onClick={crackCookie}
                  className="relative cursor-pointer group focus:outline-none"
                  aria-label="Crack the fortune cookie"
                >
                  <span
                    className={`text-8xl inline-block transition-transform duration-300 ${
                      animating ? "animate-wiggle scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                    }`}
                  >
                    🥠
                  </span>
                  {/* Sparkle hints */}
                  <div className="absolute -top-2 -right-2 text-lg animate-twinkle">✦</div>
                  <div className="absolute -bottom-1 -left-2 text-sm animate-twinkle" style={{ animationDelay: "0.5s" }}>✧</div>
                </button>
              ) : (
                <div className="animate-bounce-in">
                  {/* Cracked cookie halves */}
                  <div className="relative">
                    <span
                      className="text-6xl inline-block"
                      style={{ transform: "rotate(-20deg) translateX(-8px)" }}
                    >
                      🥠
                    </span>
                    <span
                      className="text-6xl inline-block absolute top-0 left-8"
                      style={{ transform: "rotate(15deg) scaleX(-1) translateX(-4px)" }}
                    >
                      🥠
                    </span>
                  </div>
                  {/* Paper sticking out */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-3 bg-[#fef9ef] border border-[#e8dfd2]/50 rounded-sm shadow-sm" />
                </div>
              )}
            </div>

            {/* Fortune text */}
            {cracked ? (
              <div className="space-y-4 animate-fade-up">
                <div className="bg-[#fef9ef] dark:bg-neutral-800 border border-[#e8dfd2] dark:border-neutral-700 rounded-2xl p-5 shadow-inner">
                  <p className="font-display italic text-lg text-neutral-800 dark:text-neutral-100 leading-relaxed text-balance">
                    "{fortune}"
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={reset}
                    className="text-xs text-primary/80 underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
                  >
                    crack another 🥠
                  </button>
                  <span className="text-muted-foreground/40">·</span>
                  <button
                    onClick={closeCookie}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-script text-xl text-primary">your fortune awaits</p>
                <p className="text-sm text-muted-foreground italic">tap the cookie to crack it open ✦</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          80% { transform: rotate(6deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

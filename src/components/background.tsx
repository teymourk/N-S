"use client";

// Particle data — static so no re-computation on render
const PARTICLES: Array<{
  left: number;
  startY: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}> = [
  { left:  6,  startY: 85, size: 3, delay: 0.0,  duration: 12, opacity: 0.30 },
  { left: 14,  startY: 72, size: 2, delay: 1.8,  duration: 15, opacity: 0.18 },
  { left: 23,  startY: 90, size: 4, delay: 3.4,  duration: 11, opacity: 0.25 },
  { left: 31,  startY: 60, size: 2, delay: 0.7,  duration: 18, opacity: 0.15 },
  { left: 40,  startY: 78, size: 3, delay: 5.1,  duration: 13, opacity: 0.22 },
  { left: 48,  startY: 95, size: 2, delay: 2.2,  duration: 16, opacity: 0.20 },
  { left: 55,  startY: 65, size: 4, delay: 0.4,  duration: 14, opacity: 0.28 },
  { left: 63,  startY: 88, size: 2, delay: 4.0,  duration: 10, opacity: 0.12 },
  { left: 70,  startY: 75, size: 3, delay: 1.1,  duration: 17, opacity: 0.35 },
  { left: 78,  startY: 82, size: 4, delay: 6.3,  duration: 12, opacity: 0.18 },
  { left: 85,  startY: 55, size: 2, delay: 2.9,  duration: 19, opacity: 0.22 },
  { left: 91,  startY: 92, size: 3, delay: 0.6,  duration: 11, opacity: 0.30 },
  { left: 18,  startY: 40, size: 2, delay: 7.5,  duration: 14, opacity: 0.15 },
  { left: 50,  startY: 30, size: 3, delay: 3.8,  duration: 16, opacity: 0.20 },
  { left: 75,  startY: 45, size: 2, delay: 5.6,  duration: 13, opacity: 0.25 },
  { left: 34,  startY: 20, size: 4, delay: 1.5,  duration: 15, opacity: 0.18 },
  { left: 60,  startY: 10, size: 2, delay: 4.7,  duration: 18, opacity: 0.12 },
  { left:  9,  startY: 50, size: 3, delay: 8.2,  duration: 12, opacity: 0.22 },
];

export function Background() {
  return (
    <>
      {/* Component-scoped keyframes — injected once into the document head stream */}
      <style>{`
        @keyframes bg-drift {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%;  }
          100% { background-position: 0% 50%;   }
        }

        @keyframes particle-rise {
          0%   { transform: translateY(0px)  scale(1);    opacity: 0;    }
          10%  { opacity: 1;                                               }
          85%  { opacity: 1;                                               }
          100% { transform: translateY(-120px) scale(0.6); opacity: 0;   }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          overflow: "hidden",
          backgroundColor: "#0a0812",
        }}
      >
        {/* ── Animated mesh gradient layer ──────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              "radial-gradient(circle at 20% 80%, rgba(212,165,116,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08)  0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(183,110,121,0.06) 0%, transparent 50%)",
            ].join(", "),
            backgroundSize: "200% 200%",
            animation: "bg-drift 20s ease-in-out infinite",
          }}
        />

        {/* ── Floating particles ─────────────────────────────────── */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.startY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: "#d4a574",
              opacity: 0,
              animation: `particle-rise ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* ── Grain texture overlay ──────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}

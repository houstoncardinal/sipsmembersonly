/**
 * SyrupDrip — ultra-detailed purple cough syrup drip overlay.
 * Fixed-position, pointer-events-none. z-index 0 — behind all UI.
 *
 * Features:
 *  - Thick 3-layer glossy syrup bar along the top
 *  - 16 drip stems with a glass-tube highlight (inner light reflection)
 *  - Teardrop blob drops with specular highlights
 *  - Elaborate corner pools with secondary mini-drips
 *  - Thin syrup "web threads" connecting stems at the top bar
 *  - Ambient dual-tone glow orbs
 *  - Ripple rings that pulse at drip-fall endpoints
 */

// Static drip configuration — all values hardcoded to avoid Math.random() on every render
const drips = [
  { x: "2%",   w: 6,  h: 95,  dur: 4.1, delay: 0.0,  dropW: 14 },
  { x: "6%",   w: 3,  h: 52,  dur: 5.8, delay: 0.9,  dropW: 9  },
  { x: "10%",  w: 8,  h: 140, dur: 3.6, delay: 1.7,  dropW: 18 },
  { x: "15%",  w: 4,  h: 68,  dur: 6.2, delay: 0.4,  dropW: 11 },
  { x: "20%",  w: 5,  h: 110, dur: 4.8, delay: 2.3,  dropW: 13 },
  { x: "26%",  w: 3,  h: 44,  dur: 5.5, delay: 0.7,  dropW: 9  },
  { x: "32%",  w: 7,  h: 160, dur: 3.4, delay: 1.3,  dropW: 17 },
  { x: "38%",  w: 4,  h: 82,  dur: 5.9, delay: 2.8,  dropW: 11 },
  { x: "45%",  w: 9,  h: 120, dur: 4.3, delay: 0.5,  dropW: 20 },
  { x: "52%",  w: 3,  h: 57,  dur: 6.5, delay: 1.9,  dropW: 9  },
  { x: "58%",  w: 6,  h: 105, dur: 4.0, delay: 0.2,  dropW: 15 },
  { x: "64%",  w: 4,  h: 75,  dur: 5.3, delay: 2.6,  dropW: 11 },
  { x: "70%",  w: 7,  h: 135, dur: 3.9, delay: 1.1,  dropW: 17 },
  { x: "76%",  w: 3,  h: 48,  dur: 6.0, delay: 2.0,  dropW: 9  },
  { x: "82%",  w: 5,  h: 100, dur: 4.6, delay: 0.6,  dropW: 13 },
  { x: "88%",  w: 8,  h: 88,  dur: 5.1, delay: 1.4,  dropW: 18 },
  { x: "93%",  w: 4,  h: 62,  dur: 4.9, delay: 2.2,  dropW: 11 },
];

// Web threads — thin syrup connections at top bar between some drips
const threads = [
  { x1: "2%",  x2: "6%",  sag: 8  },
  { x1: "10%", x2: "15%", sag: 10 },
  { x1: "20%", x2: "26%", sag: 7  },
  { x1: "32%", x2: "38%", sag: 12 },
  { x1: "45%", x2: "52%", sag: 9  },
  { x1: "58%", x2: "64%", sag: 11 },
  { x1: "70%", x2: "76%", sag: 8  },
  { x1: "82%", x2: "88%", sag: 10 },
];

export default function SyrupDrip() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ═══════════════════════════════════════════════════
          TOP SYRUP BAR — 3-layer glossy thick strip
          ═══════════════════════════════════════════════════ */}

      {/* Layer 1: Deep base */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "10px",
          background:
            "linear-gradient(180deg, #3d0075 0%, #6500cc 60%, #8800ee 100%)",
        }}
      />
      {/* Layer 2: Vivid mid */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "6px",
          background:
            "linear-gradient(90deg, #5500aa 0%, #a020f0 20%, #d400aa 45%, #a020f0 65%, #7c00d4 80%, #d400aa 100%)",
          boxShadow:
            "0 0 30px 8px rgba(160,32,240,0.75), 0 0 60px 16px rgba(212,0,170,0.4)",
        }}
      />
      {/* Layer 3: Specular highlight — thin bright line at top */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,200,255,0.9) 25%, rgba(255,255,255,0.95) 50%, rgba(255,200,255,0.9) 75%, transparent 100%)",
        }}
      />
      {/* Drip start dots — tiny blobs at the bottom of the bar */}
      {drips.map((d, i) => (
        <div
          key={`dot-${i}`}
          style={{
            position: "absolute",
            top: "8px",
            left: d.x,
            width: d.w + 4,
            height: d.w + 4,
            borderRadius: "50% 50% 60% 60% / 40% 40% 60% 60%",
            background:
              "radial-gradient(ellipse at 35% 30%, rgba(220,120,255,0.9) 0%, rgba(160,32,240,0.95) 55%, rgba(100,0,200,0.85) 100%)",
            boxShadow: "0 0 8px 2px rgba(200,50,255,0.5)",
            transform: "translateX(-50%)",
          }}
        />
      ))}

      {/* ═══════════════════════════════════════════════════
          SVG SYRUP THREADS — thin connecting lines
          ═══════════════════════════════════════════════════ */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "30px", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(200,50,255,0)" />
            <stop offset="30%" stopColor="rgba(180,30,240,0.7)" />
            <stop offset="70%" stopColor="rgba(220,0,180,0.7)" />
            <stop offset="100%" stopColor="rgba(200,50,255,0)" />
          </linearGradient>
        </defs>
        {threads.map((t, i) => (
          <path
            key={i}
            d={`M ${t.x1} 7 Q 50% ${7 + t.sag} ${t.x2} 7`}
            stroke="url(#threadGrad)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />
        ))}
      </svg>

      {/* ═══════════════════════════════════════════════════
          DRIP STEMS — glass-tube look with inner highlight
          ═══════════════════════════════════════════════════ */}
      {drips.map((drip, i) => (
        <div
          key={`drip-${i}`}
          style={{
            position: "absolute",
            top: "10px",
            left: drip.x,
            width: drip.w,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Stem — outer color */}
          <div
            style={
              {
                width: "100%",
                "--drip-h": `${drip.h}px`,
                "--drip-dur": `${drip.dur}s`,
                "--drip-delay": `${drip.delay}s`,
                background:
                  i % 3 === 0
                    ? "linear-gradient(180deg, #8800dd 0%, #cc00aa 100%)"
                    : i % 3 === 1
                    ? "linear-gradient(180deg, #6600cc 0%, #a020f0 100%)"
                    : "linear-gradient(180deg, #9900cc 0%, #ff00cc 100%)",
                borderRadius: "0 0 3px 3px",
                boxShadow: "0 0 6px 1px rgba(180,30,240,0.5), 0 0 16px 2px rgba(200,0,160,0.25)",
                position: "relative",
                overflow: "hidden",
              } as React.CSSProperties
            }
            className="syrup-drip-stem"
          >
            {/* Inner specular highlight — glass tube effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "15%",
                width: "25%",
                bottom: 0,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.0) 100%)",
                borderRadius: "0 0 2px 0",
              }}
            />
          </div>

          {/* Drop blob at tip */}
          <div
            style={
              {
                width: drip.dropW,
                height: drip.dropW * 1.3,
                marginTop: -2,
                "--drip-dur": `${drip.dur}s`,
                "--drip-delay": `${drip.delay}s`,
                borderRadius: "50% 50% 60% 60% / 45% 45% 55% 55%",
                background:
                  i % 2 === 0
                    ? "radial-gradient(ellipse at 35% 28%, rgba(230,150,255,0.95) 0%, rgba(180,30,240,0.9) 40%, rgba(120,0,200,0.85) 100%)"
                    : "radial-gradient(ellipse at 35% 28%, rgba(255,120,220,0.95) 0%, rgba(220,0,170,0.9) 40%, rgba(140,0,120,0.85) 100%)",
                boxShadow:
                  "0 0 14px 3px rgba(200,50,255,0.65), 0 0 30px 6px rgba(200,0,160,0.3)",
                position: "relative",
                overflow: "hidden",
              } as React.CSSProperties
            }
            className="syrup-drip-drop"
          >
            {/* Drop specular highlight */}
            <div
              style={{
                position: "absolute",
                top: "12%",
                left: "20%",
                width: "30%",
                height: "35%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.5)",
                filter: "blur(1px)",
              }}
            />
          </div>

          {/* Ripple ring at drop landing zone (static indicator) */}
          <div
            style={{
              position: "absolute",
              top: drip.h + 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: drip.dropW * 2.5,
              height: drip.dropW * 0.4,
              borderRadius: "50%",
              border: "1px solid rgba(200,50,255,0.3)",
              animation: `pool-pulse ${drip.dur}s ease-in-out infinite`,
              animationDelay: `${drip.delay + drip.dur * 0.7}s`,
            }}
          />
        </div>
      ))}

      {/* ═══════════════════════════════════════════════════
          TOP-LEFT CORNER POOL
          ═══════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 220, height: 160 }}>
        {/* Main blob */}
        <div
          className="syrup-corner-blob"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 15% 15%, rgba(200,50,255,0.65) 0%, rgba(140,0,220,0.45) 40%, transparent 70%)",
            borderRadius: "0 0 80% 0",
            filter: "blur(5px)",
          }}
        />
        {/* Secondary blob — pink accent */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: 100, height: 80,
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(255,50,200,0.4) 0%, transparent 70%)",
            borderRadius: "0 0 60% 0",
            filter: "blur(8px)",
            animation: "pool-pulse 5s ease-in-out infinite",
            animationDelay: "0.8s",
          }}
        />
        {/* Corner mini-drips */}
        {[{ left: 18, h: 65, w: 5, dur: 4.5, delay: 0.3 }, { left: 30, h: 40, w: 3, dur: 5.2, delay: 1.2 }, { left: 44, h: 50, w: 4, dur: 4.8, delay: 2.1 }].map((d, i) => (
          <div
            key={`cl-${i}`}
            style={
              {
                position: "absolute",
                top: "8px",
                left: d.left,
                width: d.w,
                "--drip-h": `${d.h}px`,
                "--drip-dur": `${d.dur}s`,
                "--drip-delay": `${d.delay}s`,
                background: "linear-gradient(180deg, rgba(180,30,240,0.9), rgba(220,0,160,0.85))",
                borderRadius: "0 0 3px 3px",
                boxShadow: "0 0 8px 2px rgba(200,50,255,0.4)",
              } as React.CSSProperties
            }
            className="syrup-drip-stem"
          />
        ))}
        {/* Outer glossy edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: 160, height: 4,
            background:
              "linear-gradient(90deg, rgba(200,50,255,0.8) 0%, rgba(255,0,200,0.6) 60%, transparent 100%)",
            boxShadow: "0 0 20px 6px rgba(200,50,255,0.4)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          TOP-RIGHT CORNER POOL
          ═══════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 240, height: 180 }}>
        <div
          className="syrup-corner-blob"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 85% 15%, rgba(255,50,180,0.6) 0%, rgba(180,0,200,0.4) 40%, transparent 70%)",
            borderRadius: "0 0 0 80%",
            filter: "blur(6px)",
            animationDelay: "1.5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: 120, height: 90,
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(220,0,255,0.4) 0%, transparent 70%)",
            borderRadius: "0 0 0 60%",
            filter: "blur(9px)",
            animation: "pool-pulse 4.5s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        />
        {[{ right: 20, h: 72, w: 6, dur: 4.2, delay: 0.5 }, { right: 36, h: 45, w: 3, dur: 5.5, delay: 1.7 }, { right: 52, h: 58, w: 4, dur: 5.0, delay: 0.9 }, { right: 68, h: 35, w: 3, dur: 6.1, delay: 2.4 }].map((d, i) => (
          <div
            key={`cr-${i}`}
            style={
              {
                position: "absolute",
                top: "8px",
                right: d.right,
                width: d.w,
                "--drip-h": `${d.h}px`,
                "--drip-dur": `${d.dur}s`,
                "--drip-delay": `${d.delay}s`,
                background: "linear-gradient(180deg, rgba(200,0,255,0.9), rgba(255,0,180,0.85))",
                borderRadius: "0 0 3px 3px",
                boxShadow: "0 0 8px 2px rgba(220,0,200,0.4)",
              } as React.CSSProperties
            }
            className="syrup-drip-stem"
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: 180, height: 4,
            background:
              "linear-gradient(270deg, rgba(255,0,200,0.8) 0%, rgba(200,50,255,0.6) 60%, transparent 100%)",
            boxShadow: "0 0 20px 6px rgba(220,0,200,0.4)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          AMBIENT GLOW ORBS — float slowly
          ═══════════════════════════════════════════════════ */}
      {[
        { top: "12%", left: "18%",  w: 340, h: 280, c1: "rgba(130,0,220,0.07)", c2: "rgba(180,0,200,0.04)", dur: 14, delay: 0   },
        { top: "8%",  right: "14%", w: 280, h: 220, c1: "rgba(200,0,180,0.06)", c2: "rgba(140,0,220,0.03)", dur: 11, delay: 3.5 },
        { top: "35%", left: "5%",   w: 200, h: 180, c1: "rgba(100,0,200,0.05)", c2: "transparent",          dur: 18, delay: 1   },
        { top: "20%", right: "8%",  w: 240, h: 200, c1: "rgba(220,0,150,0.05)", c2: "transparent",          dur: 16, delay: 5   },
      ].map((orb, i) => (
        <div
          key={`orb-${i}`}
          style={{
            position: "absolute",
            top: orb.top,
            left: "left" in orb ? (orb as any).left : undefined,
            right: "right" in orb ? (orb as any).right : undefined,
            width: orb.w,
            height: orb.h,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${orb.c1} 0%, ${orb.c2} 70%)`,
            filter: "blur(35px)",
            animation: `float ${orb.dur}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

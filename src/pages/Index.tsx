import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Crown, Sparkles, Key, Shield } from "lucide-react";
import SyrupDrip from "@/components/ui/SyrupDrip";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [syrupFlood, setSyrupFlood] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVaultOpen(true), 2000);
    const t2 = setTimeout(() => setSyrupFlood(true), 3200);
    const t3 = setTimeout(() => setLoading(false), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  /* ─── LOADING / VAULT SCREEN ──────────────────────── */
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #040008 0%, #0a0018 35%, #06000e 65%, #020006 100%)",
        }}
      >
        {/* Background syrup glow behind vault */}
        <motion.div
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(120,0,200,0.25) 0%, rgba(160,0,180,0.1) 50%, transparent 75%)",
          }}
        />

        {/* Syrup drip overlay on vault screen */}
        <SyrupDrip />

        {/* ── Vault Frame ─────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0">
            {/* Top Frame */}
            <div
              className="absolute top-0 left-0 right-0 h-28"
              style={{
                background: "linear-gradient(180deg, #06000e 0%, #0e0020 50%, #06000e 100%)",
                boxShadow: "0 10px 50px rgba(0,0,0,0.95), inset 0 -8px 30px rgba(0,0,0,0.8)",
              }}
            >
              {/* Purple glow strip on inner edge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0, left: "10%", right: "10%", height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(160,32,240,0.8), rgba(212,0,170,0.7), transparent)",
                  boxShadow: "0 0 20px 4px rgba(160,32,240,0.4)",
                }}
              />
              {/* Top bolts */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`tb-${i}`}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    left: `${9 + i * 9}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "radial-gradient(circle at 30% 30%, #3a2a50 0%, #1a0a30 60%, #0e0018 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.8), inset 0 1px 3px rgba(180,120,255,0.12)",
                  }}
                />
              ))}
            </div>

            {/* Bottom Frame */}
            <div
              className="absolute bottom-0 left-0 right-0 h-28"
              style={{
                background: "linear-gradient(0deg, #06000e 0%, #0e0020 50%, #06000e 100%)",
                boxShadow: "0 -10px 50px rgba(0,0,0,0.95), inset 0 8px 30px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: "10%", right: "10%", height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(160,32,240,0.8), rgba(212,0,170,0.7), transparent)",
                  boxShadow: "0 0 20px 4px rgba(160,32,240,0.4)",
                }}
              />
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`bb-${i}`}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    left: `${9 + i * 9}%`,
                    bottom: "50%",
                    transform: "translateY(50%)",
                    background: "radial-gradient(circle at 30% 30%, #3a2a50 0%, #1a0a30 60%, #0e0018 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.8), inset 0 1px 3px rgba(180,120,255,0.12)",
                  }}
                />
              ))}
            </div>

            {/* Left Frame */}
            <div
              className="absolute top-28 bottom-28 left-0 w-28"
              style={{
                background: "linear-gradient(90deg, #06000e 0%, #0e0020 50%, #06000e 100%)",
                boxShadow: "10px 0 50px rgba(0,0,0,0.95), inset -8px 0 30px rgba(0,0,0,0.8)",
              }}
            />
            {/* Right Frame */}
            <div
              className="absolute top-28 bottom-28 right-0 w-28"
              style={{
                background: "linear-gradient(270deg, #06000e 0%, #0e0020 50%, #06000e 100%)",
                boxShadow: "-10px 0 50px rgba(0,0,0,0.95), inset 8px 0 30px rgba(0,0,0,0.8)",
              }}
            />
          </div>

          {/* ── Purple Syrup Seam Glow ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: vaultOpen ? 0 : 0.9, scaleY: vaultOpen ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-28 bottom-28 z-10"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: "3px",
              background: "linear-gradient(180deg, transparent 5%, hsl(280 88% 65%) 15%, hsl(308 78% 65%) 85%, transparent 95%)",
              boxShadow:
                "0 0 30px 15px rgba(168,32,240,0.7), 0 0 60px 30px rgba(168,32,240,0.35), 0 0 100px 50px rgba(168,32,240,0.15)",
            }}
          />

          {/* ── Left Vault Door ─────────────────────────── */}
          <motion.div
            initial={{ x: 0 }}
            animate={vaultOpen ? { x: "-100%" } : {}}
            transition={{ duration: 3, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
            className="absolute left-0 top-28 bottom-28 w-1/2 origin-right"
          >
            <div
              className="w-full h-full relative"
              style={{
                background: "linear-gradient(135deg, rgba(20,10,35,0.98) 0%, rgba(12,6,20,0.99) 40%, rgba(6,2,12,0.98) 100%)",
                boxShadow: "inset 0 0 300px rgba(0,0,0,0.95)",
              }}
            >
              {/* Metal texture lines */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(180,120,255,0.015) 1px, rgba(180,120,255,0.015) 2px)",
                }}
              />
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,120,200,0.01) 3px, rgba(255,120,200,0.01) 4px)",
                }}
              />

              {/* Main raised panel */}
              <div
                className="absolute inset-14 rounded-3xl"
                style={{
                  background: "linear-gradient(145deg, rgba(40,20,60,0.7) 0%, rgba(20,8,35,0.8) 50%, rgba(10,4,18,0.7) 100%)",
                  boxShadow:
                    "inset 0 4px 20px rgba(180,120,255,0.08), inset 0 -4px 20px rgba(0,0,0,0.7), 0 0 0 1px rgba(140,60,200,0.15), 0 0 0 3px rgba(80,20,140,0.1)",
                }}
              >
                <div
                  className="absolute inset-6 rounded-2xl"
                  style={{
                    background: "linear-gradient(145deg, rgba(35,15,55,0.6) 0%, rgba(18,6,30,0.7) 100%)",
                    boxShadow: "inset 0 3px 15px rgba(180,120,255,0.06), inset 0 -3px 15px rgba(0,0,0,0.6)",
                  }}
                />
                <div
                  className="absolute inset-10 rounded-xl"
                  style={{ border: "1px solid rgba(140,60,200,0.15)", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}
                />
              </div>

              {/* Corner bolts with purple tint */}
              {[[16, 16], [16, null], [null, 16], [null, null]].map((pos, i) => (
                <motion.div
                  key={`cl-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="absolute w-16 h-16"
                  style={{
                    left: pos[0] !== null ? `${pos[0]}px` : "auto",
                    right: pos[0] === null ? "56px" : "auto",
                    top: pos[1] !== null ? `${pos[1]}px` : "auto",
                    bottom: pos[1] === null ? "56px" : "auto",
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, rgba(60,20,90,0.8) 0%, rgba(30,8,50,0.9) 100%)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.6), inset 0 2px 8px rgba(180,120,255,0.1), 0 0 0 1px rgba(140,60,200,0.2)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 30% 30%, #5a2a80 0%, #3a0a60 50%, #200040 100%)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 3px rgba(180,120,255,0.2)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Rivets */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`rl-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.03 }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${14 + (i % 5) * 17}%`,
                    top: `${15 + Math.floor(i / 5) * 20}%`,
                    background: "radial-gradient(circle at 30% 30%, #4a2060 0%, #2a0840 50%, #180028 100%)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.7), inset 0 1px 2px rgba(180,120,255,0.1)",
                  }}
                />
              ))}

              {/* Lock mechanism — LEFT */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28"
              >
                <motion.div
                  animate={vaultOpen ? { rotate: -90 } : {}}
                  transition={{ duration: 3, delay: 0.5 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, rgba(60,20,90,0.85) 0%, rgba(25,8,45,0.9) 100%)",
                    boxShadow: "0 0 40px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.6), 0 0 0 2px rgba(140,60,200,0.2)",
                  }}
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`gl-${i}`}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "-6px",
                        width: "3px",
                        height: "22px",
                        transform: `rotate(${i * 18}deg) translateX(-50%)`,
                        transformOrigin: "center 60px",
                        background: "linear-gradient(180deg, rgba(120,60,180,0.8) 0%, rgba(60,10,100,0.9) 100%)",
                        boxShadow: "0 0 4px rgba(180,60,240,0.3)",
                      }}
                    />
                  ))}
                </motion.div>
                <motion.div
                  animate={vaultOpen ? { rotate: 90 } : {}}
                  transition={{ duration: 3, delay: 0.7 }}
                  className="absolute inset-5 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, rgba(50,15,80,0.8) 0%, rgba(20,5,40,0.85) 100%)",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(140,60,200,0.2)",
                  }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`ml-${i}`}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "3px",
                        width: "1px",
                        height: "10px",
                        background: "rgba(160,80,220,0.3)",
                        transform: `rotate(${i * 45}deg) translateX(-50%)`,
                        transformOrigin: "center 36px",
                      }}
                    />
                  ))}
                </motion.div>
                <div
                  className="absolute inset-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #200840 0%, #10041e 50%, #06020e 100%)",
                    boxShadow: "inset 0 5px 20px rgba(0,0,0,0.8), 0 0 0 1px rgba(140,60,200,0.15)",
                  }}
                >
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                    <Lock
                      className="w-10 h-10"
                      style={{ color: "rgba(180,80,240,0.6)", filter: "drop-shadow(0 0 8px rgba(160,32,240,0.5))" }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Purple light sweep */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: vaultOpen ? 0 : 0.15 }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(180,60,240,0.12), transparent)" }}
              />

              {/* Right edge highlight */}
              <div
                className="absolute right-0 top-0 bottom-0 w-3"
                style={{
                  background: "linear-gradient(180deg, rgba(80,20,120,0.6), rgba(40,8,70,0.8), rgba(20,4,40,0.6))",
                  boxShadow: "0 0 30px rgba(0,0,0,0.9)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Right Vault Door ────────────────────────── */}
          <motion.div
            initial={{ x: 0 }}
            animate={vaultOpen ? { x: "100%" } : {}}
            transition={{ duration: 3, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
            className="absolute right-0 top-28 bottom-28 w-1/2 origin-left"
          >
            <div
              className="w-full h-full relative"
              style={{
                background: "linear-gradient(225deg, rgba(20,10,35,0.98) 0%, rgba(12,6,20,0.99) 40%, rgba(6,2,12,0.98) 100%)",
                boxShadow: "inset 0 0 300px rgba(0,0,0,0.95)",
              }}
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(180,120,255,0.015) 1px, rgba(180,120,255,0.015) 2px)",
                }}
              />
              <div
                className="absolute inset-14 rounded-3xl"
                style={{
                  background: "linear-gradient(225deg, rgba(40,20,60,0.7) 0%, rgba(20,8,35,0.8) 50%, rgba(10,4,18,0.7) 100%)",
                  boxShadow:
                    "inset 0 4px 20px rgba(180,120,255,0.08), inset 0 -4px 20px rgba(0,0,0,0.7), 0 0 0 1px rgba(140,60,200,0.15)",
                }}
              >
                <div
                  className="absolute inset-6 rounded-2xl"
                  style={{
                    background: "linear-gradient(145deg, rgba(35,15,55,0.6) 0%, rgba(18,6,30,0.7) 100%)",
                    boxShadow: "inset 0 3px 15px rgba(180,120,255,0.06), inset 0 -3px 15px rgba(0,0,0,0.6)",
                  }}
                />
                <div
                  className="absolute inset-10 rounded-xl"
                  style={{ border: "1px solid rgba(140,60,200,0.15)", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}
                />
              </div>

              {[[16, 16], [16, null], [null, 16], [null, null]].map((pos, i) => (
                <motion.div
                  key={`cr-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="absolute w-16 h-16"
                  style={{
                    left: pos[0] !== null ? `${pos[0]}px` : "auto",
                    right: pos[0] === null ? "56px" : "auto",
                    top: pos[1] !== null ? `${pos[1]}px` : "auto",
                    bottom: pos[1] === null ? "56px" : "auto",
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, rgba(60,20,90,0.8) 0%, rgba(30,8,50,0.9) 100%)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.6), inset 0 2px 8px rgba(180,120,255,0.1), 0 0 0 1px rgba(140,60,200,0.2)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 30% 30%, #5a2a80 0%, #3a0a60 50%, #200040 100%)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 3px rgba(180,120,255,0.2)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`rr-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.03 }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${14 + (i % 5) * 17}%`,
                    top: `${15 + Math.floor(i / 5) * 20}%`,
                    background: "radial-gradient(circle at 30% 30%, #4a2060 0%, #2a0840 50%, #180028 100%)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.7), inset 0 1px 2px rgba(180,120,255,0.1)",
                  }}
                />
              ))}

              {/* Lock mechanism — RIGHT */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-28 h-28"
              >
                <motion.div
                  animate={vaultOpen ? { rotate: 90 } : {}}
                  transition={{ duration: 3, delay: 0.5 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, rgba(60,20,90,0.85) 0%, rgba(25,8,45,0.9) 100%)",
                    boxShadow: "0 0 40px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.6), 0 0 0 2px rgba(140,60,200,0.2)",
                  }}
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`gr-${i}`}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "-6px",
                        width: "3px",
                        height: "22px",
                        transform: `rotate(${i * 18}deg) translateX(-50%)`,
                        transformOrigin: "center 60px",
                        background: "linear-gradient(180deg, rgba(120,60,180,0.8) 0%, rgba(60,10,100,0.9) 100%)",
                        boxShadow: "0 0 4px rgba(180,60,240,0.3)",
                      }}
                    />
                  ))}
                </motion.div>
                <motion.div
                  animate={vaultOpen ? { rotate: -90 } : {}}
                  transition={{ duration: 3, delay: 0.7 }}
                  className="absolute inset-5 rounded-full"
                  style={{
                    background: "linear-gradient(145deg, rgba(50,15,80,0.8) 0%, rgba(20,5,40,0.85) 100%)",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(140,60,200,0.2)",
                  }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`mr-${i}`}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "3px",
                        width: "1px",
                        height: "10px",
                        background: "rgba(160,80,220,0.3)",
                        transform: `rotate(${i * 45}deg) translateX(-50%)`,
                        transformOrigin: "center 36px",
                      }}
                    />
                  ))}
                </motion.div>
                <div
                  className="absolute inset-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #200840 0%, #10041e 50%, #06020e 100%)",
                    boxShadow: "inset 0 5px 20px rgba(0,0,0,0.8), 0 0 0 1px rgba(140,60,200,0.15)",
                  }}
                >
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}>
                    <Crown
                      className="w-10 h-10"
                      style={{ color: "rgba(200,100,255,0.6)", filter: "drop-shadow(0 0 8px rgba(160,32,240,0.5))" }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "-100%", opacity: vaultOpen ? 0 : 0.15 }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0"
                style={{ background: "linear-gradient(270deg, transparent, rgba(220,60,180,0.1), transparent)" }}
              />
              <div
                className="absolute left-0 top-0 bottom-0 w-3"
                style={{
                  background: "linear-gradient(180deg, rgba(80,20,120,0.6), rgba(40,8,70,0.8), rgba(20,4,40,0.6))",
                  boxShadow: "0 0 30px rgba(0,0,0,0.9)",
                }}
              />
            </div>
          </motion.div>

          {/* Center seam */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={vaultOpen ? { opacity: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="absolute top-28 bottom-28 z-10"
            style={{ width: "2px", left: "calc(50% - 1px)", background: "linear-gradient(180deg, transparent, #1a0028, transparent)", boxShadow: "0 0 15px rgba(0,0,0,0.8)" }}
          />

          {/* Purple syrup FLOOD — pours out when vault opens */}
          <AnimatePresence>
            {syrupFlood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-5"
              >
                <div
                  style={{
                    width: "800px",
                    height: "600px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse at center, rgba(180,32,240,0.22) 0%, rgba(140,0,200,0.12) 35%, rgba(220,0,170,0.06) 60%, transparent 80%)",
                    filter: "blur(40px)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading dots */}
        <motion.div
          animate={{ opacity: vaultOpen ? 0 : 1, y: vaultOpen ? 40 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-36 text-center z-20"
        >
          <p
            className="text-xs font-sans tracking-[0.5em] uppercase mb-5"
            style={{ color: "rgba(180,80,240,0.7)" }}
          >
            Authenticating Access
          </p>
          <div className="flex gap-3 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.28 }}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "linear-gradient(145deg, #aa40ff, #ff40cc)",
                  boxShadow: "0 0 20px rgba(180,32,240,0.6)",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          animate={{ opacity: vaultOpen ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-20 z-20 w-80"
        >
          <div
            className="h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(100,20,160,0.4)" }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #7c00d4, #a020f0, #d400aa)",
                boxShadow: "0 0 20px 2px rgba(180,32,240,0.7)",
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── HERO / MAIN CONTENT ─────────────────────────── */
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #040008 0%, #0c0018 30%, #080012 60%, #04000a 100%)",
      }}
    >
      {/* SyrupDrip overlay */}
      <SyrupDrip />

      {/* ── Background layers ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary center glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "20%", left: "25%",
            width: 600, height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(140,0,220,0.2) 0%, rgba(180,0,180,0.08) 50%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, delay: 4 }}
          style={{
            position: "absolute",
            bottom: "15%", right: "20%",
            width: 500, height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(220,0,160,0.18) 0%, rgba(160,0,200,0.08) 50%, transparent 75%)",
            filter: "blur(55px)",
          }}
        />
        {/* Grid lines — very faint */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(180,80,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(180,80,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, rgba(4,0,8,0.85) 100%)",
          }}
        />
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        style={{ paddingTop: "60px" }}
      >
        {/* VIP Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full mb-12"
          style={{
            background: "rgba(140,0,220,0.12)",
            border: "1px solid rgba(180,60,255,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 0 30px rgba(160,32,240,0.15), inset 0 1px 0 rgba(220,120,255,0.15)",
          }}
        >
          <Crown className="w-5 h-5" style={{ color: "hsl(280 88% 72%)", filter: "drop-shadow(0 0 6px rgba(200,50,255,0.6))" }} />
          <span
            className="text-xs font-sans font-bold tracking-[0.45em] uppercase"
            style={{ color: "rgba(220,180,255,0.9)" }}
          >
            VIP Members Only
          </span>
          <Sparkles className="w-4 h-4" style={{ color: "hsl(308 78% 65%)", filter: "drop-shadow(0 0 5px rgba(255,50,200,0.5))" }} />
        </motion.div>

        {/* Brand Icon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <motion.div
            animate={{ boxShadow: ["0 0 60px rgba(160,32,240,0.3), 0 0 120px rgba(160,32,240,0.12)", "0 0 80px rgba(160,32,240,0.55), 0 0 160px rgba(220,0,160,0.2)", "0 0 60px rgba(160,32,240,0.3), 0 0 120px rgba(160,32,240,0.12)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-3xl mb-10"
            style={{
              background:
                "linear-gradient(145deg, rgba(160,32,240,0.18), rgba(220,0,170,0.12))",
              border: "1px solid rgba(200,80,255,0.25)",
              backdropFilter: "blur(30px)",
            }}
          >
            <Crown
              className="w-16 h-16"
              style={{
                color: "rgba(210,120,255,0.95)",
                filter:
                  "drop-shadow(0 0 20px rgba(180,32,240,0.7)) drop-shadow(0 0 40px rgba(220,0,160,0.3))",
              }}
            />
          </motion.div>

          {/* Brand name */}
          <h1
            className="font-serif font-bold tracking-tight mb-6"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              lineHeight: 1.05,
              background:
                "linear-gradient(135deg, #e0aaff 0%, #c060ff 30%, #ff40cc 65%, #e0aaff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter:
                "drop-shadow(0 0 30px rgba(180,32,240,0.6)) drop-shadow(0 0 60px rgba(220,0,160,0.25))",
            }}
          >
            Sips Gettin' Real
          </h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-48 h-px mx-auto mb-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(180,60,255,0.8), rgba(255,40,200,0.8), transparent)",
              boxShadow: "0 0 20px 2px rgba(180,60,255,0.5)",
            }}
          />

          <p
            className="text-lg font-sans font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(200,170,230,0.8)" }}
          >
            The world's most exclusive private members' luxury spirits destination.
            <br />
            <span
              className="font-medium"
              style={{
                color: "hsl(308 78% 72%)",
                textShadow: "0 0 20px rgba(220,0,160,0.4)",
              }}
            >
              Invitation required.
            </span>
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24"
        >
          <Link
            to="/auth"
            className="group relative overflow-hidden px-14 py-5 rounded-2xl font-semibold text-sm tracking-widest uppercase text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c00d4 0%, #a020f0 45%, #d400aa 100%)",
              boxShadow:
                "0 0 60px rgba(160,32,240,0.45), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
              border: "1px solid rgba(220,80,255,0.3)",
            }}
          >
            {/* Shine sweep */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                animation: "syrup-shine 3s ease-in-out infinite",
              }}
            />
            <span className="relative flex items-center gap-3">
              <Key className="w-5 h-5" />
              Enter Vault
            </span>
          </Link>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgba(160,100,220,0.7)" }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted Access</span>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Crown,    title: "Exclusive Access",  desc: "Curated collection for verified members only" },
            { icon: Lock,     title: "Private & Secure",  desc: "Encrypted transactions · Maximum privacy"     },
            { icon: Sparkles, title: "Ultra Luxury",      desc: "Rare spirits unavailable anywhere else"       },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="rounded-2xl p-8 group transition-all duration-500 relative overflow-hidden"
              style={{
                background: "rgba(120,0,200,0.08)",
                border: "1px solid rgba(180,60,255,0.15)",
                backdropFilter: "blur(20px)",
              }}
              whileHover={{
                borderColor: "rgba(180,60,255,0.4)",
                boxShadow: "0 0 40px rgba(160,32,240,0.2), 0 0 80px rgba(220,0,160,0.08)",
              }}
            >
              {/* Top shine */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(200,80,255,0.5), rgba(255,40,200,0.4), transparent)",
                }}
              />
              <f.icon
                className="w-10 h-10 mx-auto mb-4 transition-transform group-hover:scale-110"
                style={{
                  color: "rgba(200,100,255,0.85)",
                  filter: "drop-shadow(0 0 10px rgba(180,32,240,0.5))",
                }}
              />
              <h3
                className="font-serif text-xl mb-3"
                style={{ color: "rgba(230,200,255,0.95)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm font-sans leading-relaxed" style={{ color: "rgba(180,140,220,0.7)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(180,60,255,0.5), rgba(255,40,200,0.4), transparent)",
          boxShadow: "0 0 20px 2px rgba(180,60,255,0.3)",
        }}
      />
    </div>
  );
}

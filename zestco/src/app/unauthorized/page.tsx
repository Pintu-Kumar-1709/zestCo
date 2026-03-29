"use client";

import { motion } from "motion/react";
import { Lock, MoveLeft, Home, ShieldCheck, Terminal } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-zinc-900/40 border border-white/5 rounded-4xl p-10 md:p-16 flex flex-col justify-between backdrop-blur-sm"
          >
            <div>
              <div className="flex items-center gap-2 mb-10 text-zinc-500">
                <ShieldCheck size={16} />
                <span className="text-[10px] uppercase tracking-[0.4em] font-mono">
                  Security Protocol Active
                </span>
              </div>

              <h1 className="text-white text-6xl md:text-8xl font-medium tracking-tight leading-[0.9]">
                Access <br />
                <span className="text-zinc-600">Restricted.</span>
              </h1>

              <p className="mt-8 text-zinc-400 text-lg md:text-xl max-w-sm font-light leading-relaxed">
                Your account lacks the necessary administrative tokens to
                interact with this node.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-12">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all flex items-center gap-3"
              >
                <MoveLeft size={18} />
                GO BACK
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-8 py-4 bg-zinc-800 text-white text-sm font-bold rounded-full border border-white/10 hover:bg-zinc-700 transition-all flex items-center gap-3"
              >
                <Home size={18} />
                DASHBOARD
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 grid grid-rows-2 gap-4">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 border border-white/5 rounded-4xl p-8 flex flex-col items-center justify-center backdrop-blur-sm group"
            >
              <div className="relative">
                <Lock
                  size={40}
                  className="text-white mb-4 group-hover:rotate-12 transition-transform duration-500"
                />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full blur-[2px]"
                />
              </div>
              <span className="text-white font-mono text-3xl font-bold">
                403
              </span>
              <span className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">
                Status Code
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900 border border-white/5 rounded-4xl p-8 flex flex-col justify-between"
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="font-mono text-[11px] space-y-1 text-zinc-500 mt-4">
                <p className="text-zinc-300 italic text-lg"> Trace results:</p>
                <p>IP: 192.168.0.1</p>
                <p>ROLE: GUEST</p>
                <p className="text-red-500/50 text-sm">PERM: DENIED</p>
              </div>
              <Terminal size={20} className="text-zinc-800 self-end" />
            </motion.div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center opacity-30 px-4 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">
          <span>Secured by Neural-Shield V2</span>
          <span className="mt-2 md:mt-0 italic underline underline-offset-4">
            Report Error
          </span>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

"use client";

import {
  Mail,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const HelpPage = () => {
  const categories = [
    {
      title: "Order & Delivery",
      desc: "Track your fresh groceries in real-time.",
      icon: <Truck size={30} />,
      link: "/user/my-orders",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Payments & Refunds",
      desc: "100% money-back guarantee on every order.",
      icon: <ShieldCheck size={30} />,
      link: "/refund",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Quick Support",
      desc: "Talk to our team for instant solutions.",
      icon: <Zap size={30} />,
      link: "mailto:support@zestco.com",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-32 px-6 overflow-hidden relative font-sans">
      <div className="absolute top-0 right-0 w-125 h-125 bg-amber-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-orange-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
            How can we <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-600">
              Assist You?
            </span>
          </h1>
          <p className="mt-8 text-gray-400 text-lg max-w-xl font-medium border-l-4 border-amber-500 pl-6 leading-relaxed">
            ZestCo support is dedicated to bringing freshness to your doorstep.
            Got a question? We&apos;ve got the answers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -12, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#18181b] border border-white/5 p-10 rounded-[3.5rem] flex flex-col justify-between h-90 cursor-pointer shadow-2xl transition-all hover:border-amber-500/20"
            >
              <div
                className={`w-16 h-16 rounded-3xl bg-linear-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}
              >
                {cat.icon}
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-black uppercase italic mb-3 tracking-tight">
                  {cat.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-semibold">
                  {cat.desc}
                </p>
              </div>
              <Link
                href={cat.link}
                className="mt-8 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:text-amber-500 transition-colors"
              >
                Learn More{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-3 transition-transform"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-linear-to-r from-[#18181b] to-transparent rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 border border-white/5"
        >
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">
              Still have <br className="hidden md:block" /> doubts?
            </h3>
            <p className="mt-4 text-gray-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">
              Support is live 24/7
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="mailto:support@zestco.com"
              className="bg-white text-black h-14 md:h-16 px-8 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-amber-600 hover:text-white transition-all shadow-xl shadow-white/5 w-full sm:w-auto"
            >
              <Mail size={18} /> Send Email
            </Link>
            <button className="bg-white/5 text-white border border-white/10 h-14 md:h-16 px-8 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all w-full sm:w-auto">
              <MessageCircle size={18} /> Live Chat
            </button>
          </div>
        </motion.div>

        <div className="text-center flex justify-center items-center group cursor-default select-none overflow-visible">
          {"ZestCo.".split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                color: "rgba(255,255,255,0.03)",
                filter: "drop-shadow(0 0 0px rgba(0,0,0,0))",
                ["WebkitTextStroke" as string]: "1px rgba(255,255,255,0.08)",
              }}
              whileHover={{
                color: "transparent",
                ["WebkitTextStroke" as string]: "1.5px #FF4D00",
                filter: [
                  "drop-shadow(0 0 15px rgba(255, 77, 0, 0.9))",
                  "drop-shadow(0 0 45px rgba(255, 128, 0, 0.5))",
                  "drop-shadow(0 0 80px rgba(255, 77, 0, 0.2))",
                ].join(" "),
                scale: 1.25,
                y: -15,
                rotate: index % 2 === 0 ? 4 : -4,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 12,
              }}
              className="text-[100px] md:text-[350px] font-black italic tracking-tighter leading-none transition-all duration-150 inline-block px-1"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

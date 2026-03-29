"use client";
import {
  ShoppingBasket,
  Truck,
  Leaf,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    Icon: ShoppingBasket,
    title: "Fresh Groceries",
    subTitle: "Handpicked fruits, vegetables & daily essentials",
    btnText: "Shop Now",
    bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=90",
  },
  {
    id: 2,
    Icon: Truck,
    title: "10 Minute Delivery",
    subTitle: "Lightning-fast delivery right to your doorstep",
    btnText: "Order Fast",
    bg: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1800&q=90",
  },
  {
    id: 3,
    Icon: Leaf,
    title: "Organic & Healthy",
    subTitle: "Fresh, organic & chemical-free products",
    btnText: "Explore",
    bg: "https://plus.unsplash.com/premium_photo-1757389476484-4bbe202e73de?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    Icon: CreditCard,
    title: "Secure Payments",
    subTitle: "UPI, Cards & Cash on Delivery supported",
    btnText: "Pay Securely",
    bg: "https://plus.unsplash.com/premium_photo-1682106686018-80ac772927d2?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      6000,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.Icon;

  return (
    <div className="relative w-[97%] mx-auto mt-28 h-[85vh] rounded-[2.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.bg}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/40 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center px-6 md:px-20">
        <motion.div
          key={slide.id}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 60 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 text-white shadow-2xl"
        >
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-500/20 mb-6"
          >
            <Icon className="w-7 h-7 text-amber-400" />
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            {slide.title}
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="mt-4 text-lg text-gray-200"
          >
            {slide.subTitle}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 px-7 py-3 rounded-full font-semibold shadow-lg transition"
          >
            {slide.btnText}
          </motion.button>
        </motion.div>
      </div>

      <button
        onClick={() =>
          setCurrent((p) => (p - 1 + slides.length) % slides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          key={current}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-amber-500"
        />
      </div>
    </div>
  );
};

export default HeroSection;

"use client";
import { ArrowRightCircle, CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const OrderSuccess = () => {
  const dotsData = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: (i % 5) * 2 + 5,
    top: (i * 7.3) % 100,
    left: (i * 13.7) % 100,
    duration: (i % 3) + 2,
    delay: i * 0.1,
  }));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {dotsData.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-amber-400"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              top: `${dot.top}%`,
              left: `${dot.left}%`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 150,
          }}
          className="flex items-center justify-center bg-amber-50 rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(251,191,36,0.3)] border border-amber-100/50"
        >
          <CheckCircle
            size={120}
            className="text-amber-600"
            strokeWidth={2.5}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-5xl font-black text-gray-900 mt-12 tracking-tighter uppercase italic leading-none"
        >
          Order <span className="text-amber-600">Successful!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 mt-6 text-base md:text-xl max-w-md font-bold leading-tight"
        >
          Great choice! Your order is being processed. <br />
          Check updates in{" "}
          <span className="text-amber-700 italic underline decoration-amber-200 decoration-4 underline-offset-4 cursor-pointer">
            My Orders
          </span>
          .
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{
          delay: 0.8,
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-8"
      >
        <Package className="w-24 h-24 text-amber-900" strokeWidth={1} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="mt-14"
      >
        <Link href={"/user/my-orders"}>
          <motion.div
            whileHover={{ backgroundColor: "#000" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-gray-900 text-white text-lg font-black  px-10 py-5 rounded-4xl shadow-2xl transition-all cursor-pointer group"
          >
            Track Your Package{" "}
            <ArrowRightCircle className="group-hover:translate-x-2 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-amber-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-green-50 rounded-full blur-[120px] opacity-40" />
      </div>
    </div>
  );
};

export default OrderSuccess;

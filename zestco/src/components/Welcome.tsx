"use client";
import { ArrowRightCircle, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

type propType = {
  nextStep: (s: number) => void
}

const Welcome = ({ nextStep }: propType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <ShoppingBasket className="w-15 h-15 text-amber-600" />
        <h1 className="text-4xl md:text-5xl text-amber-700 font-bold mb-4">
          Welcome to ZestCo
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mt-4 text-gray-700 text-lg md:text-2xl max-w-lg"
      >
        Fresh groceries. Faster than ever. <br /> Delivered to your doorstep in
        just 10 minutes.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{ scale: 0.97 }}
        className="group inline-flex items-center gap-3 mt-8 px-7 py-3
             bg-amber-600 text-white rounded-full shadow-xl
             hover:bg-amber-700
             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
             transition-all duration-300 cursor-pointer
             w-32 text-lg font-semibold"
        onClick={() => nextStep(2)}
      >
        Next
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ArrowRightCircle className="w-6 h-6" />
        </motion.span>
      </motion.button>
    </div>
  );
};

export default Welcome;

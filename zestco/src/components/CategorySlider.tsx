"use client";
import {
  Apple,
  Egg,
  Wheat,
  Cookie,
  FlaskConical,
  Beer,
  Sparkles,
  Home,
  Zap,
  Dog,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useEffect } from "react";

const CategorySlider = () => {
  const categories = [
    {
      id: 1,
      name: "Fruits & Vegetables",
      icon: Apple,
      color: "bg-green-500/10",
      border: "border-green-500/50",
      text: "text-green-500",
    },
    {
      id: 2,
      name: "Dairy & Eggs",
      icon: Egg,
      color: "bg-yellow-500/10",
      border: "border-yellow-500/50",
      text: "text-yellow-500",
    },
    {
      id: 3,
      name: "Rice, Atta & Grains",
      icon: Wheat,
      color: "bg-amber-700/10",
      border: "border-amber-700/50",
      text: "text-amber-700",
    },
    {
      id: 4,
      name: "Snacks & Biscuits",
      icon: Cookie,
      color: "bg-orange-500/10",
      border: "border-orange-500/50",
      text: "text-orange-500",
    },
    {
      id: 5,
      name: "Spices & Masala",
      icon: FlaskConical,
      color: "bg-red-500/10",
      border: "border-red-500/50",
      text: "text-red-500",
    },
    {
      id: 6,
      name: "Beverages & Drinks",
      icon: Beer,
      color: "bg-cyan-500/10",
      border: "border-cyan-500/50",
      text: "text-cyan-500",
    },
    {
      id: 7,
      name: "Personal Care",
      icon: Sparkles,
      color: "bg-pink-500/10",
      border: "border-pink-500/50",
      text: "text-pink-500",
    },
    {
      id: 8,
      name: "Household Essentials",
      icon: Home,
      color: "bg-indigo-500/10",
      border: "border-indigo-500/50",
      text: "text-indigo-500",
    },
    {
      id: 9,
      name: "Instant & Package Foods",
      icon: Zap,
      color: "bg-violet-500/10",
      border: "border-violet-500/50",
      text: "text-violet-500",
    },
    {
      id: 10,
      name: "Baby & Pet Care",
      icon: Dog,
      color: "bg-pink-500/10",
      border: "border-pink-500/50",
      text: "text-pink-500",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="w-[95%] md:w-[85%] mx-auto mt-16 relative group"
    >
      <h2 className="text-3xl md:text-4xl font-black text-amber-700 mb-10 text-center tracking-tighter">
        🛒 SHOP BY CATEGORY
      </h2>

      <button
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-xl hover:bg-amber-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        onClick={() => scroll("left")}
      >
        <ChevronLeftCircle className="w-10 h-10 text-amber-600" />
      </button>

      <div
        className="flex gap-4 md:gap-6 overflow-x-auto px-4 pb-10 scroll-smooth scrollbar-hide snap-x"
        ref={scrollRef}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                snap-center
                min-w-40 md:min-w-52 
                p-8 flex flex-col items-center justify-center 
                rounded-[2.5rem] ${cat.color} 
                shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] 
                hover:shadow-2xl hover:shadow-amber-500/10
                border border-white/40
                transition-all cursor-pointer group
              `}
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-sm group-hover:rotate-6 transition-transform">
                <Icon className={`w-10 h-10 ${cat.text}`} strokeWidth={2} />
              </div>

              <h3 className="text-sm md:text-base font-black text-gray-800 text-center leading-tight uppercase tracking-tight">
                {cat.name}
              </h3>
            </motion.div>
          );
        })}
      </div>

      <button
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-xl hover:bg-amber-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        onClick={() => scroll("right")}
      >
        <ChevronRightCircle className="w-10 h-10 text-amber-600" />
      </button>
    </motion.div>
  );
};

export default CategorySlider;

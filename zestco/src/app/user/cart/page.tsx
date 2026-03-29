"use client";
import {
  ArrowLeftCircle,
  MinusCircle,
  PlusCircle,
  SendHorizonal,
  Stars,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromcart,
} from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto mt-10 mb-20 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#18181b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />

        <Link
          href={"/"}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-500 font-bold transition-all group shrink-0 z-10"
        >
          <ArrowLeftCircle
            size={32}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="uppercase tracking-tighter text-sm">
            Return to Shop
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center md:items-end text-right z-10"
        >
          <div className="flex items-center gap-3 mb-1">
            <Stars className="text-amber-500 w-6 h-6" strokeWidth={3} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
              Your <span className="text-amber-500">Cart.</span>
            </h2>
          </div>
          <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-[0.3em]">
            Review your items before checkout
          </p>
        </motion.div>
      </div>

      {cartData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-[#18181b] rounded-[2.5rem] border border-white/5 shadow-xl"
        >
          <SendHorizonal className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-8 font-medium">
            Your cart is empty. Add some groceries to continue!
          </p>
          <Link
            href={"/"}
            className="bg-amber-600 text-white px-8 py-4 rounded-2xl hover:bg-amber-700 transition-all inline-block font-black uppercase tracking-tighter shadow-lg shadow-amber-900/20"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartData.map((item, index) => (
                <motion.div
                  key={item._id.toString() || index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col sm:flex-row items-center bg-[#18181b] rounded-3xl p-5 border border-white/5 shadow-sm group hover:border-amber-500/20 transition-all"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-[#27272a] p-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-black text-gray-100 uppercase tracking-tighter italic">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      {item.unit}
                    </p>
                    <p className="text-amber-500 font-black mt-2 text-lg italic">
                      ₹{Number(item.price) * item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-black/20 p-2 rounded-2xl border border-white/5">
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                    >
                      <MinusCircle size={24} />
                    </button>
                    <span className="font-black text-white w-6 text-center text-xl tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                      onClick={() => dispatch(increaseQuantity(item._id))}
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromcart(item._id))}
                    className="sm:ml-6 mt-4 sm:mt-0 text-gray-400 hover:text-red-500 transition-all bg-gray-800 rounded-xl p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#18181b] rounded-[2.5rem] shadow-2xl p-8 h-fit sticky top-10 border border-white/5"
          >
            <h2 className="text-3xl font-black text-white mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-200">
                <span className="font-bold uppercase text-[15px] tracking-widest">
                  Sub Total
                </span>
                <span className="text-white font-black italic tracking-tighter text-lg">
                  ₹{subTotal}
                </span>
              </div>
              <div className="flex justify-between text-gray-200">
                <span className="font-bold uppercase text-[15px] tracking-widest">
                  Delivery Fee
                </span>
                <span className="text-white font-black italic tracking-tighter text-lg">
                  ₹{deliveryFee}
                </span>
              </div>
              <div className="h-px bg-white/40 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-gray-200 font-black italic uppercase text-[20px] tracking-[0.2em]">
                  Final Total
                </span>
                <span className="text-3xl font-black text-amber-500 italic tracking-tighter">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 bg-amber-700 text-gray-200 py-4 rounded-2xl hover:bg-amber-800 transition-all font-black  uppercase  shadow-xl shadow-amber-900/20 active:scale-95"
              onClick={() => router.push("/user/checkout")}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

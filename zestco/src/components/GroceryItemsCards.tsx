"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  IndianRupee,
  MinusCircle,
  PlusCircle,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
}

const GroceryItemsCards = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id.toString() == item._id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col w-full bg-[#27272a] p-4 rounded-[2.5rem] border border-white/5 transition-all duration-300 hover:bg-[#3f3f46]"
    >
      <div className="relative aspect-square w-full mb-5 overflow-hidden rounded-4xl bg-[#18181b]/40">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain p-10 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-1 px-2 pb-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            {item.category}
          </p>
          <span className="text-[13px] italic font-bold text-gray-400 uppercase">
            {item.unit}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white leading-tight uppercase tracking-tight">
          {item.name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6 border-t border-white/5">
          <div className="flex items-center text-white bg-white/5 px-4 py-2 rounded-2xl border border-white/5 transition-all duration-300 group-hover:bg-white/10">
            <IndianRupee
              className="w-4 h-4 -mr-0.5 text-amber-500"
              strokeWidth={4}
            />
            <span className="text-2xl font-black tracking-tighter tabular-nums">
              {item.price}
            </span>
          </div>

          {!cartItem ? (
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-gray-500 text-white rounded-2xl py-3 px-4 text-xs font-black uppercase tracking-tighter transition-all active:scale-95 shadow-lg shadow-amber-900/20"
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={3} />
              <span className="hidden sm:inline">Add to cart</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1 flex items-center justify-center bg-gray-900 border border-amber-200 rounded-full py-2 px-4 gap-4"
            >
              <button className="w-8 h-8 flex items-center justify-center rounded-full transition-all">
                <MinusCircle
                  size={30}
                  className="text-amber-600"
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                />
              </button>
              <span className="text-xl font-bold text-gray-100">
                {cartItem.quantity}
              </span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full transition-all">
                <PlusCircle
                  size={30}
                  className="text-amber-600"
                  onClick={() => dispatch(increaseQuantity(item._id))}
                />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemsCards;

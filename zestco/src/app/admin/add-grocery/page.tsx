"use client";

import axios from "axios";
import {
  ArrowLeft,
  Loader,
  IndianRupee,
  ChevronDown,
  UploadCloud,
  Sparkles,
  CircleArrowUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masala",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Package Foods",
  "Baby & Pet Care ",
];

const units = ["kg", "g", "litre", "ml", "piece", "pack"];

const AddGrocery = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Please upload under 5MB.");
      return;
    }

    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !category || !price || !unit || !backendImage) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      formData.append("image", backendImage);

      const result = await axios.post("/api/admin/add-grocery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200 || result.status === 201) {
        alert("Grocery added successfully! ✅");
        window.location.reload();

        setName("");
        setCategory("");
        setUnit("");
        setPrice("");
        setPreview(null);
        setBackendImage(null);
      }
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />

      <Link
        href={"/"}
        className="fixed md:absolute top-6 left-6 z-50 flex items-center group"
      >
        <div className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center group-hover:border-amber-500/50 transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-25 transition-all duration-300 text-xs font-bold uppercase tracking-widest ml-0 group-hover:ml-3">
          Back
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#121212]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="mb-10">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Sparkles className="w-4 h-4 fill-amber-500" />
            <span className="text-sm font-black uppercase tracking-[0.3em]">
              Fill Out Details for Your Products:-
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            ADD GROCERY.
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="text"
              required
              placeholder=" "
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-amber-500/50 transition-all font-medium placeholder-transparent"
            />
            <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all peer-focus:-top-3 peer-focus:text-lg peer-focus:text-amber-500 peer-focus:bg-[#121212] peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-lg peer-[:not(:placeholder-shown)]:text-amber-500 peer-[:not(:placeholder-shown)]:bg-[#121212] peer-[:not(:placeholder-shown)]:px-2">
              Item Name
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <select
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer font-medium"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option className="bg-[#121212]" value="">
                  Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} className="bg-[#121212]" value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative group">
              <select
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer font-medium"
                onChange={(e) => setUnit(e.target.value)}
                value={unit}
              >
                <option className="bg-[#121212]" value="">
                  Unit
                </option>
                {units.map((u) => (
                  <option key={u} className="bg-[#121212]" value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500">
              <IndianRupee className="w-5 h-5" />
            </div>
            <input
              type="number"
              required
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-amber-500/50 transition-all font-bold text-xl"
            />
          </div>

          <div className="relative">
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full min-h-35 border-2 border-dashed border-white/10 rounded-4xl bg-white/2 hover:bg-amber-500/2 hover:border-amber-500/40 transition-all cursor-pointer overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                  >
                    <Image
                      src={preview}
                      alt="preview"
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    className="flex flex-col items-center gap-2"
                  >
                    <UploadCloud className="w-8 h-8 text-amber-500 opacity-80" />
                    <span className="text-lg font-bold text-gray-400  ">
                      Upload Photo
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black text-lg py-5 rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest cursor-pointer"
          >
            {loading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CircleArrowUp className="w-6 h-6" />
                Add Grocery
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;

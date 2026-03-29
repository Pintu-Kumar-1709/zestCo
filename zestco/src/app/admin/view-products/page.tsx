"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Edit,
  Loader,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/grocery.model";
import Image from "next/image";

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

const ViewProducts = () => {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>([]);
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<IGrocery[]>([]);

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const res = await axios.get("/api/admin/get-groceries");
        setGroceries(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getGroceries();
  }, []);

  // --- Search Logic Start ---
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(groceries);
    } else {
      const q = search.toLowerCase();
      const filteredData = groceries.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q),
      );
      setFiltered(filteredData);
    }
  }, [search, groceries]);
  // --- Search Logic End ---

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    if (!editing || !editing._id) return;
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("groceryId", String(editing._id));
      formData.append("name", editing?.name);
      formData.append("category", editing?.category);
      formData.append("price", editing?.price.toString());
      formData.append("unit", editing?.unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post("/api/admin/edit-grocery", formData);
      if (res.status === 200) {
        setEditing(null);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing || !editing._id) return;
    setDeleteLoading(true);
    try {
      const res = await axios.post("/api/admin/delete-grocery", {
        groceryId: editing._id,
      });
      if (res.status === 200) {
        setEditing(null);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
        >
          <ArrowLeftCircle size={20} /> <span>Back</span>
        </button>
        <h1 className=" flex text-xl md:text-2xl font-semibold text-amber-700 items-center justify-center gap-2">
          <SlidersHorizontal size={22} /> Manage Groceries
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-5 py-2 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
      >
        <Search className="text-gray-500 w-6 h-6 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-500 bg-transparent"
          placeholder="Search by Name & Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <X
            className="cursor-pointer text-gray-400 hover:text-red-500"
            size={18}
            onClick={() => setSearch("")}
          />
        )}
      </motion.div>

      <div className="space-y-4">
        {filtered?.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 transition-all"
          >
            <div className="relative w-full sm:w-35 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image fill src={g.image} alt={g.name} className="object-cover" />
            </div>

            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate capitalize">
                  {g.name}
                </h3>
                <p className="text-gray-700 text-base capitalize">
                  {g.category}
                </p>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-amber-700 font-semibold text-lg">
                  ₹{g.price}{" "}
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    {g.unit}
                  </span>
                </p>
                <button
                  className="bg-amber-600 text-white px-4 py-2 rounded-xl text-center font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-all"
                  onClick={() => setEditing(g)}
                >
                  <Edit size={18} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-4xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl flex gap-2 font-bold text-amber-700 items-center">
                  <SlidersHorizontal size={20} /> Edit Grocery
                </h2>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  onClick={() => setEditing(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-2 border border-gray-200 group bg-gray-50">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-cover"
                  />
                )}
                <label
                  htmlFor="imageUpload"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-gray-100 text-xl font-bold gap-2"
                >
                  <Upload size={40} />
                  <span>Replace Image</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="imageUpload"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[16px] font-bold text-gray-700 ml-1">
                    Product Name
                  </p>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-[16px] font-bold text-gray-700 ml-1">
                      Category
                    </p>
                    <select
                      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-medium text-gray-700 appearance-none cursor-pointer"
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[16px] font-bold text-gray-700 ml-1">
                      Unit
                    </p>
                    <select
                      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-medium text-gray-700 appearance-none cursor-pointer"
                      value={editing.unit}
                      onChange={(e) =>
                        setEditing({ ...editing, unit: e.target.value })
                      }
                    >
                      {units.map((u, idx) => (
                        <option key={idx} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[16px] font-bold text-gray-700 ml-1">
                    Price (₹)
                  </p>
                  <input
                    type="text"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-xl font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  disabled={editLoading}
                  className="flex-1 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-70"
                  onClick={handleEdit}
                >
                  {editLoading ? (
                    <Loader className="animate-spin" size={22} />
                  ) : (
                    <>
                      <ArrowRightCircle size={22} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white font-semibold py-3.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  onClick={handleDelete}
                >
                  {deleteLoading ? (
                    <Loader className="animate-spin" size={22} />
                  ) : (
                    <>
                      <Trash2 size={22} />
                      <span>Delete Grocery</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewProducts;

"use client";

import axios from "axios";
import { Motorbike, User2, UserCog2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditRoleMobile = () => {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", Icon: UserCog2 },
    { id: "user", label: "User", Icon: User2 },
    { id: "deliveryBoy", label: "Delivery Boy", Icon: Motorbike },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEdit = async () => {
    if (!selectedRole || mobile.length !== 10) return;

    setLoading(true);

    try {
      await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });

      router.push("/");
    } catch (error) {
      console.error("Error updating role and mobile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");
        if (result.data.adminExists) {
          setRoles((prev) => prev.filter((r) => r.id !== "admin"));
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkForAdmin();
  }, []);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-center mt-8 text-amber-700"
      >
        Select Your Role
      </motion.h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.Icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center justify-center
                w-48 h-48 rounded-3xl border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-amber-600 bg-amber-100 shadow-lg"
                    : "border-gray-300 hover:border-amber-400"
                }`}
            >
              <Icon className="w-10 h-10 mb-6 text-amber-700" />
              <span className="font-medium">{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center mt-10"
      >
        <label className="text-gray-700 text-lg font-bold mb-2">
          Enter Your Mobile Number
        </label>
        <input
          type="tel"
          className="border border-gray-500 rounded-2xl px-4 py-3 w-72 focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-800"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>

      <div className="flex justify-center">
        <motion.button
          disabled={mobile.length !== 10 || !selectedRole || loading}
          className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md duration-200 mt-6 ${
            selectedRole && mobile.length === 10
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleEdit}
        >
          {loading ? "Saving..." : "Next"}
        </motion.button>
      </div>
    </div>
  );
};

export default EditRoleMobile;

"use client";

import { IndianRupee, Package, Truck, UserCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type propType = {
  earning: {
    today: number;
    sevenDaysAgo: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
  chartData: {
    day: string;
    orders: number;
  }[];
};

const AdminDashboardClient = ({ earning, stats, chartData }: propType) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">();

  const currentEarning =
    filter === "today"
      ? earning.today
      : filter === "sevenDays"
        ? earning.sevenDaysAgo
        : earning.total;

  const title =
    filter === "today"
      ? "Today's Earnings"
      : filter === "sevenDays"
        ? "Last 7 Days Earnings"
        : "Total Earnings";

  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto">
      <div className="flex flex-col gap-4 mb-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-amber-600"
        >
          🎗️ Admin Dashboard
        </motion.h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none transition w-full sm:w-auto"
          onChange={(e) => setFilter(e.target.value as any)}
          value={filter}
        >
          <option value="total">Total</option>
          <option value="last 7 days">Last 7 Days</option>
          <option value="today">Today</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-amber-100 border border-amber-300 shadow-sm rounded-2xl p-6 text-center mb-10"
      >
        <h2 className="text-2xl font-semibold text-amber-600 mb-2">{title}</h2>
        <p className="text-3xl font-bold">₹{currentEarning.toFixed(2)}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const icons = [
            <Package key="p" className="text-amber-600 w-6 h-6" />,
            <UserCircle2 key="u" className="text-amber-600 w-6 h-6" />,
            <Truck key="t" className="text-amber-600 w-6 h-6" />,
            <IndianRupee key="i" className="text-amber-600 w-6 h-6" />,
          ];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 border border-yellow-500 shadow-sm rounded-xl p-5 flex items-center gap-5 transition-all hover:shadow-md"
            >
              <div className="bg-amber-100 p-3 rounded-full">
                {icons[idx % icons.length]}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-600">
                  {stat.title}
                </p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gray-100 border border-amber-500 rounded-2xl shadow-md p-5 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          📈 Orders Overview (Last 7 days)
        </h2>
        <div className="border-b mb-2" />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#808080" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="orders" fill="#FFD566" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardClient;

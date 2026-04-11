"use client";

import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import axios from "axios";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  UserCheck2,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>(order.status);
  const statusOption = ["pending", "out of delivery", "delivered", "cancelled"];
  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.post(`/api/admin/update-order-status/${orderId}`, {
        status,
      });

      setStatus(status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() == order._id?.toString()) {
        setStatus(data.status);
      }
    });
    return () => socket.off("order-status-update");
  }, [order._id]);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <p className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <Package size={22} className="text-amber-600" />
            Order #{order._id?.toString().slice(-6).toUpperCase()}
          </p>

          <div className="flex gap-2">
            {status?.toLowerCase() !== "delivered" && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  order.isPaid
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            )}

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${
                status === "delivered"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-500 font-medium text-sm mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          <div className="mt-4 space-y-2 text-gray-700 text-sm">
            <p className="flex items-center gap-3 font-semibold">
              <UserCircle size={20} className="text-amber-600" />
              <span>{order.address.fullName}</span>
            </p>
            <p className="flex items-center gap-3 font-semibold">
              <Phone size={20} className="text-amber-600" />
              <span>{order.address.mobile}</span>
            </p>
            <p className="flex items-start gap-3 font-semibold">
              <MapPin size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{order.address.fullAddress}</span>
            </p>
          </div>

          <div className="border-t border-gray-400 mt-4 pt-3 flex items-center gap-3 font-semibold text-gray-700 text-sm">
            <CreditCard size={20} className="text-amber-600" />
            <span>
              {order.paymentMethod === "cod"
                ? "Cash On Delivery"
                : "Online Payment"}
            </span>
          </div>

          {order.assignedDeliveryBoy && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm to-gray-700">
                <UserCheck2 className="text-blue-700" size={22} />
                <div className="font-semibold text-gray-700">
                  <p>
                    Assigned to :{" "}
                    <span className="font-bold text-md">
                      {order.assignedDeliveryBoy.name}
                    </span>{" "}
                  </p>
                  <p className=" flex items-center text-sm text-gray-700 pl-18 mt-1">
                    {" "}
                    <Phone
                      className="text-blue-700 font-semibold"
                      size={15}
                    />{" "}
                    +91
                    <span className="font-bold">
                      {order.assignedDeliveryBoy.mobile}
                    </span>{" "}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition ml-10"
              >
                Call
              </a>
            </div>
          )}
        </div>

        {status?.toLowerCase() !== "delivered" && (
          <div className="flex flex-col items-start md:items-end gap-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
              Update Status
            </label>
            <select
              className="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold bg-gray-50 outline-none focus:border-amber-600 transition-all cursor-pointer"
              value={status}
              onChange={(e) =>
                updateStatus(order._id!.toString(), e.target.value)
              }
            >
              {statusOption.map((st) => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="border-t border-gray-400 mt-6 pt-4">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-bold text-gray-600 hover:text-amber-700 transition"
        >
          <span className="flex items-center gap-2">
            <Package size={20} className="text-amber-600" />
            {expanded ? "Hide Order Items" : `View ${order.items.length} Items`}
          </span>
          {expanded ? (
            <ChevronUpCircle size={24} className="text-amber-600" />
          ) : (
            <ChevronDownCircle size={24} className="text-amber-600" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 border border-gray-500 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base capitalize font-bold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          {item.quantity} x {item.unit}
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      ₹{Number(item.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-400 mt-6 pt-4 flex flex-wrap justify-between items-center gap-4 font-bold">
        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <Truck size={22} className="text-amber-600" />
          <span>
            Current Status:{" "}
            <span className="text-amber-700 uppercase">{status}</span>
          </span>
        </div>
        <div className="text-xl text-gray-900">
          Total : <span className="text-amber-700">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCard;

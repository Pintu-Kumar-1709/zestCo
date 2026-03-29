"use client";

import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  UserCheck2,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
    <motion.div
      initial={{}}
      animate={{}}
      transition={{}}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-amber-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            order{" "}
            <span className="text-amber-700 font-bold">
              #{order?._id?.toString()?.slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-gray-700 mt-1 italic font-semibold">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status?.toLowerCase() !== "delivered" && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                order.isPaid
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
          )}

          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(status)}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {order.paymentMethod == "cod" ? (
          <div className="flex items-center gap-2 to-gray-700 font-semibold text-sm">
            <Truck size={20} className="text-amber-600" />
            Cash On Delivery
          </div>
        ) : (
          <div className="flex items-center gap-2 to-gray-700 font-semibold text-sm">
            <CreditCard size={20} className="text-amber-600" />
            Online Payment
          </div>
        )}
        {order.assignedDeliveryBoy && status?.toLowerCase() !== "delivered" && (
          <>
            {" "}
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
                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Call
              </a>
            </div>
            {status?.toLowerCase() !== "delivered" && (
              <button
                className="w-full flex items-center justify-center gap-8 bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-amber-700 transition"
                onClick={() =>
                  router.push(`/user/track-order/${order._id?.toString()}`)
                }
              >
                <Truck size={20} />
                Track Your Order
              </button>
            )}
          </>
        )}

        <div className="flex items-center gap-2 to-gray-700 font-semibold text-sm">
          <MapPin size={20} className="text-amber-600" />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex justify-between items-center text-sm font-medium to-gray-700 hover:text-amber-700 transition"
          >
            <span className="flex items-center gap-2 text-base">
              <Package size={20} className="text-amber-600" />
              {expanded
                ? "Hide Order Items"
                : `View ${order.items.length} Items`}
            </span>
            {expanded ? (
              <ChevronUpCircle size={20} className="text-amber-600" />
            ) : (
              <ChevronDownCircle size={20} className="text-amber-600" />
            )}
          </button>

          <motion.div
            initial={{ height: 0, opacity: 1 }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-base font-medium to-gray-800">
                        {item.name}
                      </p>
                      <p className="text-s to-gray-500">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold to-gray-800">
          <div className="flex items-center gap-2 to-gray-700 text-sm">
            <Truck size={20} className="text-amber-600" />
            <span>
              Delivery : <span className="text-amber-700">{status}</span>{" "}
            </span>
          </div>
          <div className="text-lg">
            Total :
            <span className="text-amber-700 font-bold ">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderCard;

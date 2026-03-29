"use client";

import LiveMap from "@/components/LiveMap";
import { RootState } from "@/redux/store";
import axios from "axios";
import {
  ArrowLeftCircle,
  CheckCircle2,
  Truck,
  PackageCheck,
  Send,
  Sparkle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import "leaflet/dist/leaflet.css";
import { IUser } from "@/models/user.model";

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

const TrackOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [suggestions, setSuggestions] = useState([
    "Building ke niche aa jao",
    "Parcel bahar chhod dijiye",
    "5 mins mein niche aata hoon.",
  ]);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const getSuggestion = async (currentMessages = messages) => {
    try {
      setSuggestLoading(true);
      const lastMsg =
        currentMessages
          .filter((m) => m.senderId.toString() !== userData?._id)
          .at(-1)?.text || "No last messages yet";
      const result = await axios.post("/api/chat/ai-suggestion", {
        message: lastMsg,
        role: "user",
      });
      if (Array.isArray(result.data)) setSuggestions(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSuggestLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const socket = getSocket();
    socket.emit("join-room", orderId);

    const fetchData = async () => {
      try {
        const [orderRes, msgRes] = await Promise.all([
          axios.get(`/api/user/get-order/${orderId}`),
          axios.post("/api/chat/message", { roomId: orderId }),
        ]);
        setOrder(orderRes.data);
        setUserLocation({
          latitude: orderRes.data.address.latitude,
          longitude: orderRes.data.address.longitude,
        });
        setMessages(msgRes.data);
        if (msgRes.data.length > 0) getSuggestion(msgRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on("new-message", (msg: IMessage) => {
      if (msg.roomId.toString() === orderId) {
        setMessages((prev) => {
          const updated = [...prev, msg];
          if (msg.senderId.toString() !== userData?._id) getSuggestion(updated);
          return updated;
        });
      }
    });

    socket.on("update-deliveryBoy-location", (data) => {
      const lat = data.location.coordinates?.[0] ?? data.location.latitude ?? 0;
      const lng =
        data.location.coordinates?.[1] ?? data.location.longitude ?? 0;
      setDeliveryBoyLocation({ latitude: lat, longitude: lng });
    });

    return () => {
      socket.off("new-message");
      socket.off("update-deliveryBoy-location");
      socket.emit("leave-room", orderId);
    };
  }, [orderId, userData?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!newMessage.trim()) return;
    getSocket().emit("send-message", {
      roomId: orderId,
      text: newMessage.trim(),
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setNewMessage("");
  };

  if (loading || !order)
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <p className="animate-pulse text-gray-500 font-medium">
          Loading order...
        </p>
      </div>
    );

  const steps = [
    { label: "Preparing", icon: PackageCheck },
    { label: "Out for Delivery", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStep =
    order.status === "pending" ? 0 : order.status === "out of delivery" ? 1 : 2;

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 z-50">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition"
          >
            <ArrowLeftCircle size={22} />
          </button>
          <div>
            <h2 className="text-lg font-semibold">Track Order</h2>
            <p className="text-xs text-gray-500">#{order._id?.slice(-6)}</p>
          </div>
        </div>

        <div className="px-6 mt-8 relative flex justify-between">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10" />
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width:
                currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%",
            }}
            className="absolute top-5 left-0 h-1 bg-amber-500 rounded-full -z-10"
          />
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-1/3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                <step.icon size={18} />
              </div>
              <p
                className={`text-xs mt-2 ${index <= currentStep ? "text-amber-600" : "text-gray-400"}`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <div className="px-4 mt-8">
          <LiveMap
            userLocation={userLocation}
            deliveryBoyLocation={deliveryBoyLocation}
          />
        </div>
        <div className="border-t mt-8" />

        <div className="bg-white rounded-3xl shadow-lg border p-4 flex flex-col h-105 mt-8">
          <div className="flex justify-between items-center bg-purple-300 w-full p-2 rounded-2xl mb-4">
            <span className="font-semibold text-black text-[15px] flex items-center gap-1 pl-2">
              Quick Replies
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => getSuggestion()}
              disabled={suggestLoading}
              className="px-3 py-1 text-[14px] font-semibold flex items-center gap-1 bg-purple-200 text-purple-700 rounded-full border border-purple-500 shadow-sm"
            >
              <Sparkle
                size={15}
                className={suggestLoading ? "animate-spin" : ""}
              />{" "}
              AI Suggest
            </motion.button>
          </div>

          <div className="flex gap-2 flex-wrap mb-3 min-h-10">
            <AnimatePresence mode="wait">
              {suggestLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-24 bg-purple-100 animate-pulse rounded-full border border-purple-200"
                    />
                  ))}
                </div>
              ) : (
                suggestions.map((sugg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-sm bg-amber-100 border border-amber-300 text-amber-800 rounded-full cursor-pointer shadow-sm"
                    onClick={() => setNewMessage(sugg)}
                  >
                    {sugg}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-300 to-white rounded-xl">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id?.toString() ?? index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId.toString() === userData?._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[75%] wrap-break-word ${msg.senderId.toString() === userData?._id ? "bg-amber-600 text-white rounded-br-none" : "bg-white border rounded-bl-none"}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`text-[11px] mt-2 opacity-70 text-right ${msg.senderId.toString() === userData?._id ? "text-white/70" : "text-gray-400"}`}
                    >
                      {msg.time?.toString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t">
            <textarea
              placeholder="Type message..."
              className="flex-1 bg-gray-200 px-4 py-2 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 resize-none h-12 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMsg())
              }
            />
            <button
              onClick={sendMsg}
              disabled={!newMessage.trim()}
              className="bg-amber-600 hover:bg-amber-700 p-3 rounded-2xl text-white active:scale-95 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

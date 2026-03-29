"use client";

import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send, Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type Props = {
  orderId: string;
  deliveryBoyId: string;
};

const DeliveryBoyChat = ({ orderId, deliveryBoyId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [suggestions, setSuggestions] = useState([
    "Sir, main gate pe hoon",
    "Calling bell baja dena please",
    "Order deliver ho gaya hai, thank you!",
  ]);

  const getSuggestion = async (currentMessages = messages) => {
    try {
      setSuggestLoading(true);

      const lastMsg =
        currentMessages
          .filter((m) => m.senderId.toString() !== deliveryBoyId)
          .at(-1)?.text || "No last messages yet";

      const result = await axios.post("/api/chat/ai-suggestion", {
        message: lastMsg,
        role: "delivery_boy",
      });

      if (Array.isArray(result.data)) {
        setSuggestions(result.data);
      }
    } catch (error: any) {
      console.log("Suggestion Error:", error.response?.data || error.message);
    } finally {
      setSuggestLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const socket = getSocket();
    socket.emit("join-room", orderId);

    const getAllMessages = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/api/chat/message", {
          roomId: orderId,
        });
        setMessages(result.data);
        if (result.data.length > 0) getSuggestion(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAllMessages();

    const handleNewMessage = (message: IMessage) => {
      if (message.roomId.toString() === orderId) {
        setMessages((prev) => {
          const updated = [...prev, message];

          if (message.senderId.toString() !== deliveryBoyId)
            getSuggestion(updated);
          return updated;
        });
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave-room", orderId);
    };
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!newMessage.trim()) return;
    const socket = getSocket();
    const message = {
      roomId: orderId,
      text: newMessage.trim(),
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    setNewMessage("");
  };

  if (loading)
    return (
      <div className="bg-white rounded-3xl shadow-lg border p-6 flex items-center justify-center h-115">
        <p className="animate-pulse text-gray-500 font-medium">
          Loading chat...
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 flex flex-col h-115">
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
          <Sparkle size={15} className={suggestLoading ? "animate-spin" : ""} />
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
                className="px-3 py-1 text-sm bg-amber-100 border border-amber-300 text-amber-800 rounded-full cursor-pointer shadow-sm hover:bg-amber-200"
                onClick={() => setNewMessage(sugg)}
              >
                {sugg}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-300 to-white rounded-xl">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            No messages yet
          </p>
        )}
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id?.toString() ?? index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.senderId.toString() === deliveryBoyId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative px-4 py-2 rounded-2xl max-w-[75%] shadow-sm ${
                  msg.senderId.toString() === deliveryBoyId
                    ? "bg-amber-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${msg.senderId.toString() === deliveryBoyId ? "text-white/70" : "text-gray-400"}`}
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
          placeholder="Type a message..."
          className="flex-1 bg-gray-200 px-4 py-2 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition resize-none h-12 text-sm"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMsg())
          }
        />
        <button
          disabled={!newMessage.trim()}
          className="bg-amber-600 hover:bg-amber-700 p-3 rounded-2xl text-white transition active:scale-95 disabled:opacity-50"
          onClick={sendMsg}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryBoyChat;

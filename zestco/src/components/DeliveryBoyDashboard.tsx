"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "./LiveMap";
import DeliveryBoyChat from "./DeliveryBoyChat";
import { Loader } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IDeliveryBoyDashboardProps {
  earning: number;
  orderCount: number;
}

const DeliveryBoyDashboard = ({
  earning,
  orderCount,
}: IDeliveryBoyDashboardProps) => {
  const chartData = [
    {
      day: "Today",
      earnings: earning,
      deliveries: orderCount,
    },
  ];

  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignment");
      setAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        longitude: location.coordinates[1],
        latitude: location.coordinates[0],
      });
    });
    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator) return;
    socket.emit("identity", userData._id);
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: long,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: long,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [deliveryAssignment, ...prev]);
    });

    return () => {
      socket.off("new-assignment");
    };
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);

      fetchCurrentOrder();

      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData?._id) return;

    const loadData = async () => {
      await fetchCurrentOrder();
      await fetchAssignments();
    };

    loadData();
  }, [userData?._id]);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder?.order?._id,
      });
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder?.order?._id,
        otp,
      });
      if (result.status === 200) {
        setActiveOrder(null);
        setShowOtpBox(false);
        setVerifyOtpLoading(false);
        window.location.reload();
      }
    } catch (error) {
      setOtpError(`OTP verification error :${error}`);
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  if (activeOrder && userLocation && userData?._id) {
    return (
      <div className="p-4 pt-27.5 min-h-screen bg-gray-200">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-amber-600">
            Active Delivery
          </h1>
          <p className="text-gray-600 bg-blue-200 w-fit rounded-full p-1 text-sm mb-4 font-bold">
            order #{activeOrder?.order?._id.slice(-6)}
          </p>
          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <DeliveryBoyChat
            orderId={activeOrder?.order?._id}
            deliveryBoyId={userData._id.toString()}
          />

          <div className="mt-4 bg-gray-200 rounded-2xl shadow-md border p-1">
            {!activeOrder?.order?.deliveryOtpVerification && !showOtpBox && (
              <button
                onClick={sendOtp}
                disabled={sendOtpLoading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                {sendOtpLoading ? (
                  <Loader
                    className="animate-spin text-center text-white"
                    size={20}
                  />
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            )}
            {showOtpBox && (
              <div className="mt-2 p-2">
                <input
                  type="text"
                  className="w-full py-3 border rounded-lg text-center font-bold"
                  placeholder="Enter OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  className="w-full mt-2 py-3  bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center"
                  onClick={verifyOtp}
                  disabled={otp.length !== 4 || verifyOtpLoading}
                >
                  {verifyOtpLoading ? (
                    <Loader className="animate-spin  text-white" size={16} />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                {otpError && (
                  <div className="text-red-500 text-sm mt-2">{otpError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-500 via-gray-700 to-gray-100 mt-18 py-10">
      <div className="max-w-3xl mx-auto px-5">
        <div className="mb-5">
          <h2 className="text-4xl font-bold text-gray-900">
            Delivery Assignments.
          </h2>
          <p className="text-gray-900 font-semibold">
            Nearby orders waiting for pickup.
          </p>
        </div>

        {assignments.length > 0 ? (
          assignments.map((a: any) => (
            <div
              key={a?._id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 mb-5 transition hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold uppercase text-gray-950  bg-gray-300 rounded-full px-4 py-1">
                  Order ID
                </span>
                <span className="bg-gray-300 text-amber-700 text-sm font-bold px-4 py-1 rounded-full">
                  #{a?.order?._id?.slice(-6)}
                </span>
              </div>

              <div className="bg-gray-300 rounded-2xl p-4 mb-5">
                <p className="text-gray-900 font-medium leading-relaxed">
                  📍 {a?.order?.address?.fullAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="py-3 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
                  onClick={() => handleAccept(a._id)}
                >
                  Accept
                </button>
                <button className="py-3 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all">
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-gray-100 border border-amber-500 rounded-3xl shadow-md p-10 text-center text-gray-500 mb-6">
              <div className="text-5xl mb-4">📦</div>
              <p className="font-semibold text-xl">No orders right now!</p>
              <p className="text-lg mt-1">
                Please wait, you will see new deliveries here as soon as they
                are available...
              </p>
            </div>

            <div className="bg-gray-400 border border-slate-100 rounded-[2.5rem] shadow-sm p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Today&apos;s Performance
                  </h2>
                  <p className="text-sm font-medium text-slate-600 italic">
                    Deliveries Today: {orderCount}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-amber-600 ">
                    ₹{earning}
                  </span>
                  <p className="text-[13px] font-bold text-slate-700 ">
                    Net Total
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 35, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#111", fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#111", fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc", radius: 10 }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      itemStyle={{ color: "#d97706", fontWeight: "800" }}
                    />
                    <Bar
                      name="Daily Payout"
                      dataKey="earnings"
                      fill="#111"
                      radius={[10, 10, 10, 10]}
                      barSize={45}
                      label={{
                        position: "top",
                        fill: "#111",
                        fontSize: 12,
                        fontWeight: "bold",
                        offset: 15,
                        formatter: (value: any) => `₹${value}`,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-slate-300 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[11px] font-bold text-slate-700 ">
                      Rate
                    </p>
                    <p className="text-base font-bold text-amber-600">
                      ₹40/Order
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-slate-300 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[11px] font-bold text-slate-700 ">
                      Status
                    </p>
                    <p className="text-base font-bold text-green-600 ">
                      Active
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-amber-600 rounded-2xl py-2 px-3 font-semibold text-white hover:underline"
                >
                  Refresh
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;

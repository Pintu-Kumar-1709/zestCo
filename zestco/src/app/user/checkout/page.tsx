"use client";

import dynamic from "next/dynamic";
import { RootState } from "@/redux/store";
import {
  ArrowLeftCircle,
  Compass,
  CreditCard,
  Landmark,
  Loader,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Truck,
  UserCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckOutMap = dynamic(() => import("@/components/CheckOutMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
      <Loader className="animate-spin text-amber-600" />
    </div>
  ),
});

interface IAddress {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { deliveryFee, subTotal, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );

  const [address, setAddress] = useState<IAddress>({
    fullName: userData?.name || "",
    mobile: userData?.mobile || "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Location error", err),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  const handlerSearchQuery = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    const { OpenStreetMapProvider } = await import("leaflet-geosearch");
    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      if (results && results.length > 0) {
        setPosition([results[0].y, results[0].x]);
        setSearchQuery("");
      } else {
        alert("Location not found! Please try another name.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const { data } = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        setAddress((prev) => ({
          ...prev,
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
          fullAddress: data.display_name || "",
        }));
      } catch (error) {
        console.log("Reverse geocode error", error);
      }
    };
    fetchAddress();
  }, [position]);

  const handleCod = async () => {
    if (!position) return;
    try {
      await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({ ...item, grocery: item._id })),
        totalAmount: finalTotal,
        address: { ...address, latitude: position[0], longitude: position[1] },
        paymentMethod,
      });
      router.push("/user/order-success");
    } catch (error) {
      console.log(`COD error: ${error}`);
    }
  };

  const handleOnlinePayment = async () => {
    if (!position) return;
    try {
      const { data } = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => ({ ...item, grocery: item._id })),
        totalAmount: finalTotal,
        address: { ...address, latitude: position[0], longitude: position[1] },
        paymentMethod,
      });
      window.location.href = data.url;
    } catch (error) {
      console.log(`Online payment error: ${error}`);
    }
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        className="absolute left-0 top-2 flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold cursor-pointer z-10"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeftCircle size={30} />
        <span className="font-bold text-lg">Back to Cart</span>
      </motion.button>

      <motion.h1 className="text-3xl md:text-4xl font-bold text-amber-700 text-center mt-1">
        Details of Your Products
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <motion.div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-amber-700" /> Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <UserCircle2
                className="absolute left-2 top-3 text-amber-600"
                size={25}
              />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-2 top-3 text-amber-600"
                size={25}
              />
              <input
                type="tel"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div className="relative">
              <Landmark
                className="absolute left-2 top-3 text-amber-600"
                size={25}
              />
              <input
                type="text"
                value={address.fullAddress}
                placeholder="Full Address"
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Compass
                  className="absolute left-2 top-3 text-amber-600"
                  size={25}
                />
                <input
                  type="text"
                  value={address.city}
                  placeholder="City"
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <div className="relative">
                <Navigation
                  className="absolute left-2 top-3 text-amber-600"
                  size={25}
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="State"
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <div className="relative">
                <LocateFixed
                  className="absolute left-2 top-3 text-amber-600"
                  size={25}
                />
                <input
                  type="tel"
                  value={address.pincode}
                  placeholder="PinCode"
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-lg bg-gray-100 font-semibold outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3 font-semibold">
              <input
                type="text"
                placeholder="Search City or Area"
                className="flex-1 border rounded-lg p-3 text-m focus:ring-2 focus:ring-amber-700 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-amber-600 text-white px-5 rounded-2xl hover:bg-amber-700 transition-all font-medium cursor-pointer"
                onClick={handlerSearchQuery}
              >
                {searchLoading ? (
                  <Loader size={25} className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0">
              {position ? (
                <>
                  <CheckOutMap position={position} setPosition={setPosition} />
                  <motion.button
                    whileTap={{ scale: 0.82 }}
                    className="absolute bottom-4 right-4 bg-amber-600 text-white shadow-lg rounded-full p-3 hover:bg-amber-700 transition-all flex items-center justify-center z-1000"
                    onClick={handleCurrentLocation}
                  >
                    <LocateFixed size={20} />
                  </motion.button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse flex flex-col items-center justify-center gap-2">
                  <div className="w-7 h-7 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-700 font-bold text-s tracking-tighter">
                    Fetching Location...
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-amber-600" /> Payment Method
          </h2>
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "online" ? "border-amber-600 bg-amber-50 shadow-sm" : "hover:bg-amber-100"}`}
            >
              <CreditCard className="text-amber-600" />{" "}
              <span className=" text-gray-700 font-semibold">Pay Online</span>
            </button>
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "cod" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-green-100"}`}
            >
              <Truck className="text-green-600" />{" "}
              <span className=" text-gray-700 font-semibold">
                Cash On Delivery
              </span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Sub Total</span>
              <span className="font-semibold text-lg text-amber-700">
                ₹{subTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fees</span>
              <span className="font-semibold text-lg text-amber-700">
                ₹{deliveryFee}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span className="font-semibold text-gray-950">Final Total</span>
              <span className=" text-amber-700">₹{finalTotal}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="w-full mt-6 bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition-all font-semibold"
            onClick={() =>
              paymentMethod == "cod" ? handleCod() : handleOnlinePayment()
            }
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

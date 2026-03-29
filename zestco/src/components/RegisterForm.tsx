"use client";

import {
  ArrowLeftCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  UserCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import google from "@/assets/google.png";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type propType = {
  prevStep: (s: number) => void;
};

const RegisterForm = ({ prevStep }: propType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) return;

    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("registration error:", error.response?.data);
      } else {
        console.log("unexpected error:", error);
      }
      setLoading(false);
    }
  };

  const formValid = Boolean(name && email && password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-amber-600 cursor-pointer hover:text-amber-800 transition"
        onClick={() => prevStep(1)}
      >
        <ArrowLeftCircle className="w-8 h-8" />
        <span className="font-bold text-lg">Back</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-amber-700 mb-2"
      >
        Create an Account
      </motion.h1>
      <p className="text-gray-800 mb-8 text-xl">Join ZestCo today!</p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleRegister}
      >
        <div className="relative">
          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            className="peer w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:border-amber-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 font-semibold text-gray-500 bg-white px-1 transition-all peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber-600 peer-valid:top-0 peer-valid:text-sm">
            Enter Full Name
          </label>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            required
            className="peer w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:border-amber-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 font-semibold text-gray-500 bg-white px-1 transition-all peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber-600 peer-valid:top-0 peer-valid:text-sm">
            Enter your Email
          </label>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            required
            className="peer w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:border-amber-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          <label className="absolute left-10 top-1/2 -translate-y-1/2 font-semibold text-gray-500 bg-white px-1 transition-all peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber-600 peer-valid:top-0 peer-valid:text-sm">
            Enter Password
          </label>
        </div>

        <button
          disabled={!formValid || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md ${
            loading
              ? "bg-amber-400 cursor-not-allowed"
              : formValid
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Register"
          )}
        </button>

        <div
          className="w-full flex items-center justify-center gap-3 border border-gray-400 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-semibold cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src={google} width={25} height={25} alt="Google Logo" />
          Continue with Google
        </div>
      </motion.form>

      <p className="text-gray-700 mt-6 text-sm flex items-center gap-2 font-semibold">
        Already have an account?
        <span
          className="text-amber-800 cursor-pointer hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;

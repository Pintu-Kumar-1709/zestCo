"use client";

import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import google from "@/assets/google.png";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);

    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("login error:", error.response?.data);
      } else {
        console.log("unexpected error:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-amber-700 mb-2"
      >
        Welcome Back!
      </motion.h1>

      <p className="text-gray-800 mb-8 text-xl">Login to ZestCo!</p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleLogin}
      >
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
          disabled={!email || !password || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md ${
            loading
              ? "bg-amber-400 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Login"
          )}
        </button>

        <div
          className="w-full flex items-center justify-center gap-3 border border-gray-400 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-semibold transition-all duration-300 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src={google} width={25} height={25} alt="Google Logo" />
          Continue with Google
        </div>
      </motion.form>

      <p className="text-gray-700 mt-6 text-sm flex items-center gap-2 font-semibold">
        Want to create an account?
        <span
          className="text-amber-800 cursor-pointer hover:underline"
          onClick={() => router.push("/register")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;

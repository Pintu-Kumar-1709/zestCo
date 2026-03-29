"use client";

import { FiInstagram } from "react-icons/fi";
import {
  FaSquareFacebook,
  FaGithub,
  FaLinkedin,
  FaSquareXTwitter,
} from "react-icons/fa6";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpCircle } from "lucide-react";

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  const socialLinks = [
    { Icon: FaSquareFacebook, href: "https://facebook.com/Mrkumar.Sajan.12x" },
    { Icon: FaLinkedin, href: "https://www.linkedin.com/in/pintu-kumar-12x" },
    { Icon: FiInstagram, href: "https://instagram.com/babu_sajan_12" },
    { Icon: FaSquareXTwitter, href: "https://x.com/babu_sajan_12" },
    { Icon: FaGithub, href: "https://github.com/Pintu-Kumar-1709" },
  ];

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-linear-to-br from-gray-950 via-gray-900 to-black text-gray-300 mt-24 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="group">
            <h2 className="relative text-3xl font-bold text-white tracking-wide inline-block">
              Zest<span className="text-amber-500">Co</span>
              <span className="absolute -right-3 -bottom-1 w-10 h-0.75 bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </h2>
            <p className="mt-5 text-sm text-gray-300 leading-relaxed">
              Redefining freshness with every delivery. Experience premium
              <span className="text-amber-500 "> quality groceries,</span>{" "}
              handpicked for you and delivered with unwavering trust.
            </p>
          </div>

          <div className="group">
            <h3 className="relative text-white font-semibold mb-4 inline-block">
              Quick Links
              <span className="absolute -right-3 -bottom-1 w-10 h-0.5 bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/" },
                { name: "Orders", href: "/user/my-orders" },
                { name: "Contact", href: "/help" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-400 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="group">
            <h3 className="relative text-white font-semibold mb-4 inline-block">
              Support
              <span className="absolute -right-3 -bottom-1 w-10 h-0.5 bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms", href: "/terms" },
                { name: "Refund", href: "/refund" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-400 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="group">
            <h3 className="relative text-white font-semibold mb-4 inline-block">
              Connect
              <span className="absolute -right-3 -bottom-1 w-10 h-0.5 bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </h3>

            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="group/icon"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 shadow-md transition-all duration-300 hover:border-amber-400"
                  >
                    <span className="absolute inset-0 rounded-xl bg-amber-500/20 opacity-0 group-hover/icon:opacity-100 blur-md transition" />
                    <social.Icon
                      size={20}
                      className="relative text-gray-300 group-hover/icon:text-amber-400 transition"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-gray-300 mt-4">
              Follow us for updates & offers 🚀
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 text-center py-5 text-base text-amber-600 font-semibold  ">
          © {new Date().getFullYear()} ZestCo. All rights reserved.
        </div>
      </motion.footer>

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showTop ? 1 : 0,
          scale: showTop ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-opacity ${
          !showTop && "pointer-events-none"
        }`}
      >
        <ArrowUpCircle size={22} />
      </motion.button>
    </>
  );
};

export default Footer;

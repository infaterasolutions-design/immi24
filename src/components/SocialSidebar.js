"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaXTwitter, FaLinkedinIn, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa6";

export default function SocialSidebar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolledDown = scrollY > 200;
      
      const documentHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
      const distanceToBottom = documentHeight - (window.innerHeight + scrollY);
      const isNearBottom = distanceToBottom < 400; // Footer height is approx 300-400px

      setVisible(isScrolledDown && !isNearBottom);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const socialLinks = [
    {
      name: "X",
      url: "https://x.com/usimminews",
      icon: <FaXTwitter size={18} />,
      hoverClass: "hover:bg-black hover:border-black",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/united-states-immigration-news",
      icon: <FaLinkedinIn size={18} />,
      hoverClass: "hover:bg-blue-700 hover:border-blue-700",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61580097382101",
      icon: <FaFacebook size={18} />,
      hoverClass: "hover:bg-blue-600 hover:border-blue-600",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@unitedstatesimmigrationnews",
      icon: <FaYoutube size={18} />,
      hoverClass: "hover:bg-red-600 hover:border-red-600",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/unitedstatesimmigrationnews/",
      icon: <FaInstagram size={18} />,
      hoverClass: "hover:bg-pink-500 hover:border-pink-500",
    },
  ];

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white border border-gray-200 shadow-md text-gray-500 hover:text-white transition-colors duration-200 ${link.hoverClass}`}
        >
          {link.icon}
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-3 py-1 bg-black text-white text-[12px] rounded-full opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}

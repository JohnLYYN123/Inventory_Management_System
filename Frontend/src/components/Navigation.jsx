// NavigationBar.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "../assets/IMS_icon.png";
import { User } from "lucide-react";

const navigation_link = [
  { name: "Devices", path: "/mydevices" },
  { name: "Requests Management", path: "/requestmanagment" },
  { name: "Profile", path: "/profile" },
];

export default function NavigationBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // unwrap your stored shape:
      const identity = parsed.data?.identity || parsed.identity || parsed;
      setUser(identity);
      setDisplayName(identity.displayName || identity.userName || "");
    } catch {
      // invalid JSON – ignore
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full border-b bg-gray-50 shadow-sm">
      <div className="flex items-center w-full max-w-screen space-x-6 mx-auto">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="DeviceHub Logo"
            className="w-20 h-20 object-contain"
          />
          <span className="text-2xl font-bold whitespace-nowrap">
            DeviceHub
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-grow flex justify-center space-x-6">
          {navigation_link.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-lg font-medium transition-colors hover:text-blue-500",
                location.pathname === link.path && "text-blue-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: User info / Sign in/out */}
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-gray-600" />
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-800">
                {displayName}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-500 hover:underline"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-lg font-medium hover:text-blue-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

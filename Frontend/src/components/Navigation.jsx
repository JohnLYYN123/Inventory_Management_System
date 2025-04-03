"use client"

import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import logo from "../assets/IMS_icon.png";
import { User } from "lucide-react";

const navigation_link = [
    { name: "My Devices", path: "/mydevices"},
    { name: "Requests Management", path: "/requestmanagment"},
    { name: "Profile", path: "/profile"}
];

function NavigationBar() {
    const location = useLocation();


    return (
        <nav className="w-full border-b bg-gray-50 shadow-sm">
            <div className="flex items-center w-full max-w-screen space-x-6 mx-auto">
                {/* Left: Logo and Title */}
                <div className="flex items-center space-x-4 ">
                    <img src={logo} alt="DeviceHub Logo" className="w-20 h-20 object-contain" />
                    <span className="text-2xl font-bold whitespace-nowrap">DeviceHub</span>
                </div>
            
                {/* Center: Navigation Links */}
                <div className="flex-grow flex justify-center space-x-6">
                    {navigation_link.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={cn(
                        "text-lg font-medium transition-colors hover:text-blue-500"
                        )}
                    >
                        {link.name}
                    </Link>
                    ))}
                </div>
            
                {/* Right: Sign In and Sign out*/}
                <div className="flex items-center space-x-2">
                    <User className="w-10 h-10 text-muted-foreground" />
                    {localStorage.getItem("user") ? (() => {
                        const user = JSON.parse(localStorage.getItem("user"));
                            return (
                                <div className="flex items-center gap-5">
                                    <span className="text-sm text-gray-700">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("user");
                                            window.location.href = "/login";
                                        }}
                                        className="text-sm font-medium text-red-500 hover:underline"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            );
                        })() : (
                            <Link to="/login" className="text-lg font-medium hover:text-blue-500">
                                Sign In
                            </Link>
                        )}
                </div>
            </div>
      </nav>
    )
}

export default NavigationBar
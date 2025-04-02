"use client"

import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import logo from "../assets/IMS_icon.png";
import { User } from "lucide-react";

const navigation_link = [
    { name: "My Devices", path: "/"},
    { name: "Requests Management", path: "/"},
    { name: "Profile", path: "/login"}
];

function NavigationBar() {
    const location = useLocation();

    return (
        <nav className="w-full border-b bg-gray-100 shadow-sm">
            <div className="flex items-center justify-between x-4 max-w-screen-xl mx-auto w-full px-8 py-3 flex items-center justify-between">
            {/*Logo and Title */}
            <div className="flex items-center space-x-6">
                <img src={logo} alt="DeviceHub Logo" className="w-20 h-20 object-contain" />
                <span className="text-xl font-semibold whitespace-nowrap">DeviceHub</span>
            </div>
    
            {/*Navigation Links */}
            <div className="flex space-x-6 justify-center">
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
    
            <div className="flex items-center space-x-6">
                <User className="w-5 h-5 text-muted-foreground" />
                <Link to="/login" className="text-sm font-medium hover:text-blue-500">
                Sign In
                </Link>
            </div>
        </div>
      </nav>
    )
}

export default NavigationBar
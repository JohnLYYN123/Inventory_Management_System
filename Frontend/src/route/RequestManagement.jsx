import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"


const mockData = [
    { id: "REQ-001", status: "pending", date: "2025-03-14", device: "MacBook Pro M3" },
    { id: "REQ-002", status: "completed", date: "2025-03-13", device: "iPhone 15 Pro" },
    { id: "REQ-003", status: "rejected", date: "2025-03-12", device: "Dell XPS 15" },
  ];

function RequestManagement(){
    // used for the buttons of all, pending, completed, rejected 
    const [mode, setMode] = useState("all");
    const [requests, setRequests] = useState(mockData);

    const modeData = mode === "all" ? mockData : modeData.filter(item=> item.status === mode);

    return(
        <div className="px-10 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mt-4">Request Management</h1>
                <div className="w-1/6">
                    <Button className="w-full" variant="buttonBlue">+ New Request</Button>
                </div>
            </div>
            <div className="flex gap-2 mb-4">
                {["all", "pending", "completed", "rejected"].map((f) => (
                <button
                    key={f}
                    onClick={() => setMode(f)}
                    className={`px-4 py-1 rounded-md border ${
                    mode === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
                ))}
            </div>

        </div>
    )
}

export default RequestManagement
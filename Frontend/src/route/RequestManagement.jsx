import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"

function RequestManagement(){
    // used for the buttons of all, pending, completed, rejected 
    const [mode, setMode] = useState("all");
    return(
        <div className="px-10 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mt-4">Request Management</h1>
                <div className="w-1/6">
                    <Button className="w-full" variant="buttonBlue">+ New Request</Button>
                </div>
            </div>
            
        </div>
    )
}

export default RequestManagement
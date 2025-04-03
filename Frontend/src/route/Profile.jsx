import React from "react";
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { User, KeyRound, Pencil } from "lucide-react";

const mockUser = {
    name: "Lin",
    title: "Hardware engineer",
    email: "Lin@admin.IMS.ca",
    department: "Engineering", 
    location: "Toronto, ON",
    employeeId: "EMP-2025-0123"
};

function Profile() {
    const [profile, setProfile] = useState(mockUser);
    
    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-10">
            <div className="flex items-center space-x-4 mb-4">
                <div>
                    <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-gray-500">{profile.title}</p>
                </div>
            </div>

            <div className="text-sm mb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                <p><strong>Employee ID:</strong> {profile.employeeId}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-semibold">Profile Actions</p>

                <div className="flex gap-3">
                    <Button variant="buttonBlue" className="flex items-center gap-2">
                        <Pencil size={16} /> Edit Profile
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <KeyRound size={16} /> Change Password
                    </Button>
                </div>
            </div>
        </div>

    )
}

export default Profile;
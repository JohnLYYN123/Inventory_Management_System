import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";

function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState("");



    // On mount, fetch admin user profile by ID
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate('/login');
            return;
        }
        const parsed = JSON.parse(stored);
        const user = parsed.data?.identity || parsed.identity || parsed;
        const token = parsed.data?.token || parsed.token;

        const fetchProfile = async () => {
            try {
                const resp = await fetch(
                    `http://localhost:3000/api/users/${encodeURIComponent(user.email)}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const result = await resp.json();
                if (!resp.ok || !result.success) {
                    setError(result.message || "Failed to load profile");
                    return;
                }
                setProfile(result.data);
                setEditProfile(result.data);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching profile");
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleSaveProfile = async () => {
        setError("");
        const stored = JSON.parse(localStorage.getItem("user"));
        const token = stored.data?.token || stored.token;
        try {
            const resp = await fetch(
                `http://localhost:3000/api/users/${encodeURIComponent(profile.email)}/edit`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        displayName: editProfile.displayName ?? "",
                        userName: editProfile.userName ?? "",
                        email: editProfile.email ?? "",
                        department: editProfile.department ?? "",
                        location: editProfile.location ?? "",
                    }),
                }
            );
            const result = await resp.json();
            if (!resp.ok || !result.success) {
                setError(result.message || "Failed to update profile");
                return;
            }
            setProfile(result.data);
            setIsEditingProfile(false);
        } catch (err) {
            console.error(err);
            setError("An error occurred while updating profile");
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-10">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex items-center space-x-4 mb-4">
                <User className="w-10 h-10 text-muted-foreground" />
                <div>
                    <h2 className="text-xl font-semibold">
                        {profile.displayName || profile.userName}
                    </h2>
                    <p className="text-sm text-gray-500">{profile.role}</p>
                </div>
            </div>

            <div className="text-sm mb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                <p><strong>User Name:</strong> {profile.userName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                <p><strong>User ID:</strong> {profile.id}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-semibold">Profile Actions</p>
                <div className="flex gap-3">
                    <Button
                        variant="buttonBlue"
                        className="flex items-center gap-2"
                        onClick={() => setIsEditingProfile(true)}
                    >
                        <Pencil size={16} /> Edit Profile
                    </Button>
                </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            value={editProfile.department ?? ""}
                            onChange={(e) =>
                                setEditProfile({ ...editProfile, department: e.target.value })
                            }
                        />
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={editProfile.location ?? ""}
                            onChange={(e) =>
                                setEditProfile({ ...editProfile, location: e.target.value })
                            }
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditingProfile(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="buttonBlue" onClick={handleSaveProfile}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AdminProfile;

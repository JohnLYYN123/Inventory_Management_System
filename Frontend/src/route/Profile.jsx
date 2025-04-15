import React from "react";
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { User, KeyRound, Pencil, Eye, EyeOff } from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"

const mockUser = {
    name: "Lin",
    title: "Hardware engineer",
    email: "Lin@admin.IMS.ca",
    department: "Engineering", 
    location: "Toronto, ON",
    employeeId: "EMP-2025-0123", 
    password: "1234"
};

function Profile() {
    const [profile, setProfile] = useState(mockUser);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editProfile, setEditProfile] = useState(profile);
    const [editPassword, setEditPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    

    const handleSaveProfile = async () => {
        setProfile(editProfile);
        setIsEditingProfile(false);
    }

    const handleChangePassword = async () => {
        if (editPassword === confirmPassword) {
            setProfile({ ...profile, password: editPassword });
            setIsChangingPassword(false);
        }
        else if (editPassword === profile.password || confirmPassword === profile.password) {
            alert("New password cannot be the same as the old password!");
        }
         else {
            alert("Passwords do not match!");
        }
    }
    
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
                    <Button 
                        variant="buttonBlue" 
                        className="flex items-center gap-2"
                        onClick={() => setIsEditingProfile(true)}
                    >
                        <Pencil size={16} /> Edit Profile
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => setIsChangingPassword(true)}
                    >
                        <KeyRound size={16} /> Change Password
                    </Button>
                </div>
            </div>

            {/* When user is editing profile */}
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={editProfile.name}
                            onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                            placeholder="Please enter your new name"
                         />
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={editProfile.title}
                            onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                            placeholder="Please enter your new title"
                         />
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={editProfile.email}
                            onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                            placeholder="Please enter your new email"
                         />
                         <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            name="department"
                            value={editProfile.department}
                            onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
                            placeholder="Please enter your new department"
                         />
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={editProfile.location}
                            onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                            placeholder="Please enter your new location"
                         />
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                        <Button variant="buttonBlue" onClick={handleSaveProfile}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* When user is changing password */}
            <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Update your password</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                value={editPassword}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="Please enter your new password"
                            />
                            <button 
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Please confirm your new password"
                            />
                            <button 
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleChangePassword}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default Profile;
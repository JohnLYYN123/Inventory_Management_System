import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, KeyRound, Pencil, Eye, EyeOff } from "lucide-react";

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

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editProfile, setEditProfile] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // On mount, fetch user profile
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

  if (!profile) return <div>Loading...</div>;

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
            displayName: editProfile.displayName,
            userName: editProfile.userName,
            email: editProfile.email,
            department: editProfile.department,
            location: editProfile.location,
            title: editProfile.title,
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

  const handleChangePassword = async () => {
    setError("");
    if (!editPassword || editPassword !== confirmPassword) {
      setPasswordError("Passwords must match and not be empty");
      return;
    }
    setPasswordError("");
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored.data?.token || stored.token;
    try {
      const resp = await fetch(
        `http://localhost:3000/api/users/${profile.id}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: editPassword }),
        }
      );
      const result = await resp.json();
      if (!resp.ok || !result.success) {
        setError(result.message || "Failed to change password");
        return;
      }
      setIsChangingPassword(false);
      alert("Password updated successfully");
    } catch (err) {
      console.error(err);
      setError("An error occurred while changing password");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-10">
      <div className="flex items-center space-x-4 mb-4">
        <User className="w-10 h-10 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold">{profile.displayName || profile.userName}</h2>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="text-sm mb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
        <p><strong>User Name:</strong> {profile.userName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Employee ID:</strong> {profile.id}</p>
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="displayname">Display Name</Label>
            <Input
              id="displayname"
              value={editProfile.displayName}
              onChange={(e) => setEditProfile({ ...editProfile, displayName: e.target.value })}
            />
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              value={editProfile.userName}
              onChange={(e) => setEditProfile({ ...editProfile, userName: e.target.value })}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editProfile.email}
              onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
            />
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={editProfile.department}
              onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
            />
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editProfile.location}
              onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
            <Button variant="buttonBlue" onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
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
                type={showPassword ? "text" : "password"}
                value={editPassword}
                onChange={(e) => {
                  setEditPassword(e.target.value);
                  if (confirmPassword && e.target.value !== confirmPassword) {
                    setPasswordError("Passwords do not match");
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="Enter new password"
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (editPassword && e.target.value !== editPassword) {
                    setPasswordError("Passwords do not match");
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleChangePassword}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;

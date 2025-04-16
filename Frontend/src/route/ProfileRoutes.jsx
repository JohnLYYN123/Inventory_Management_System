import React from 'react';
import Profile from './Profile';
import AdminProfile from './AdminProfile';

const ProfileRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.role === "admin") {
        return <AdminProfile />;
    }
    return <Profile />;
}

export default ProfileRoutes;
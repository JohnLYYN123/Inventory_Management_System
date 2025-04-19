import React from 'react';
import Profile from './Profile';
import AdminProfile from './AdminProfile';

const ProfileRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const role = currentUser.data.identity.role;
    if (currentUser && role.toLowerCase() === "admin") {
        return <AdminProfile />;
    }
    return <Profile />;
}

export default ProfileRoutes;
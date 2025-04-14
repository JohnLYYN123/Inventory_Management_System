import React from 'react';
import MyDevice from './MyDevice';
import AdminDevice from './AdminDevice';

const MyDeviceRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.role === "admin") {
        return <AdminDevice />;
    }
    return <MyDevice />;
}

export default MyDeviceRoutes;
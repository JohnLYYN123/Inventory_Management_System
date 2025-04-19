import React from 'react';
import MyDevice from './MyDevice';
import AdminDevice from './AdminDevice';

const MyDeviceRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const role = currentUser.data.identity.role;
    if (currentUser && role.toLowerCase() === "admin") {
        return <AdminDevice />;
    }
    return <MyDevice />;
}

export default MyDeviceRoutes;
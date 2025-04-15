import React from 'react';
import AdminRequestManagement from './AdminRequestManagement';
import RequestManagement from './RequestManagement';


const RequestManagementRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.role === "admin") {
        return <AdminRequestManagement />;
    }
    return <RequestManagement />;
}

export default RequestManagementRoutes;
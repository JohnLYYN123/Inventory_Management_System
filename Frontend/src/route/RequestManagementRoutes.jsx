import React from 'react';
import AdminRequestManagement from './AdminRequestManagement';
import RequestManagement from './RequestManagement';

const RequestManagementRoutes = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const role = currentUser.data.identity.role;
    
    if (currentUser && role.toLowerCase() === "admin") {
        return <AdminRequestManagement />;
    }
    return <RequestManagement />;
}

export default RequestManagementRoutes;
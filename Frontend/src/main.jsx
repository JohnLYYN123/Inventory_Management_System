import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import './index.css'
// import App from './route/App.jsx'
import Login from './route/Login.jsx';
import Layout from './route/Layout.jsx';
//import RequestManagement from './route/RequestManagement.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './route/Profile.jsx';
import MyDeviceRoutes from './route/MyDeviceRoutes.jsx';
import RequestManagementRoutes from './route/RequestManagementRoutes.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <MyDeviceRoutes />,
      },
      {
        path: '/mydevices', 
        element: <MyDeviceRoutes />
      },
      {
        path: '/requestmanagment', 
        element: <RequestManagementRoutes />
      },
      {
        path: '/profile',
        element: <Profile />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './router/App.jsx'
import React from 'react'
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./router/home.jsx"
import LoginRegister from './router/Login_Register.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/loginregister',
    element: <LoginRegister/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

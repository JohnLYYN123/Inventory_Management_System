import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './router/App.jsx'
import React from 'react'
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./router/home.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

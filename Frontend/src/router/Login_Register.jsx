import React from "react";
import { useState, useEffect } from "react";

function LoginRegister(){
    const [isLogin, setIsLogin] = useState(true);
    const [logInInfo, setLogInInfo] = useState({
        email: "", 
        password: "", 
        rememberMe: false
    });
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "", 
        role: "User",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin && form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Form Submitted:", form);
        };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-1">Device Management</h2>
                <p className="text-center text-gray-600 mb-6">
                    Welcome back to your device dashboard
                </p>

                <div className="flex justify-center mb-6 space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md font-semibold ${
                        isLogin
                            ? "bg-blue-500 text-white"
                            : "border border-blue-500 text-blue-500"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );  
}

export default LoginRegister
import React from "react";
import { useState, useEffect } from "react";

// component imports
import { Button } from "@/components/ui/button"
import { buttonVariants  } from "../components/ui/button";

// icon imports
import { Mail, Lock, CircleUser } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import { Checkbox } from "@/components/ui/checkbox.jsx"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


function Login(){
    const [activeTab, setActiveTab] = useState("login");

    // shared state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // register-only state
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");


    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
            <Card className="w-full max-w-[650px]">
                <CardHeader>
                    <div>
                        <CardTitle className="text-3xl font-bold flex justify-center">Device Management</CardTitle>
                        <CardDescription className="flex justify-center">Welcome back to your device dashboard</CardDescription>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Tabs defaultValue="login" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            {/* login tab */}
                            <TabsContent value="login">
                                <div className="w-full space-y-2">
                                    <Label htmlFor="email" className="relative left-1 space-y-4">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="email"
                                            type="email" 
                                            placeholder="Enter your email" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>
                                <div className="w-full space-y-4">
                                    <Label htmlFor="password" className="relative left-1 top-3">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="password"
                                            type="password" 
                                            placeholder="Enter your password" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>

                                 {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="rememberMe" />
                                            <label
                                                htmlFor="rememberMe"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                remember me
                                            </label>
                                    </div>
                                    <a
                                    href="#"
                                    className="text-sm text-blue-500 hover:underline"
                                    >
                                    Forgot password?
                                    </a>
                                </div>

                                <div className="w-full mt-4">
                                    <Button className="w-full" variant="buttonBlue">Log In</Button>
                                </div>
                            </TabsContent>

                            {/* Register tab */}
                            <TabsContent value="register">
                                <div className="w-full space-y-2">
                                    <Label htmlFor="username" className="relative left-1 space-y-4">username</Label>
                                    <div className="relative">
                                        <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="username"
                                            type="username" 
                                            placeholder="Choose a username" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>
                                <div className="w-full space-y-4">
                                    <Label htmlFor="email" className="relative left-1 top-3">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="email"
                                            type="email" 
                                            placeholder="Enter your email" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>
                                <div className="w-full space-y-4">
                                    <Label htmlFor="password" className="relative left-1 top-3">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="password"
                                            type="password" 
                                            placeholder="Create your password" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>
                                <div className="w-full space-y-4">
                                    <Label htmlFor="confirmPassword" className="relative left-1 top-3">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <Input
                                            id="confirmPassword"
                                            type="confirmPassword" 
                                            placeholder="Confirm your password" 
                                            className='pl-10'
                                        ></Input>
                                    </div>
                                </div>

                                <div className="w-full space-y-4">
                                <Label htmlFor="confirmPassword" className="relative left-1 top-3">Role</Label>
                                <RadioGroup defaultValue="user" className="flex space-x-6">
                                    <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="user" id="user" />
                                    <Label htmlFor="user">User</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admin" id="admin" />
                                    <Label htmlFor="admin">Admin</Label>
                                    </div>
                                </RadioGroup>
                                </div>

                                <div className="w-full mt-4">
                                    <Button className="w-full" variant="buttonBlue">Register</Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardHeader>
            </Card>
        </div>
        
    )
}

export default Login

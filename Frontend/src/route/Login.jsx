// import React from "react";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // component imports
// import { Button } from "@/components/ui/button"
// import { buttonVariants  } from "../components/ui/button";

// // icon imports
// import { Mail, Lock, CircleUser } from "lucide-react"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
//   } from "@/components/ui/tabs"

// import { Checkbox } from "@/components/ui/checkbox.jsx"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


// function Login(){
//     const [activeTab, setActiveTab] = useState("login");

//     // shared state
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [rememberMe, setRememberMe] = useState(false);

//     // register-only state
//     const [username, setUsername] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [role, setRole] = useState("user");

//     const navigate = useNavigate();

//     const handleLogin = async () => {
//         const role = email.toLowerCase().includes("admin") ? "admin" : "user";
//         const mockUser = {
//             email, 
//             token: "mock-token",
//             role
//         };

//         if(!email || !password){
//             alert("Please enter your email and password");
//             return;
//         }

//         // new we need some logics
//         console.log(mockUser);
//         localStorage.setItem("user", JSON.stringify(mockUser));

//         if (rememberMe) {
//             localStorage.setItem("rememberMe", JSON.stringify(mockUser));
//         }

//         navigate("/mydevices");
//     };


//     return (
//         <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
//             <Card className="w-full max-w-[650px]">
//                 <CardHeader>
//                     <div>
//                         <CardTitle className="text-3xl font-bold flex justify-center">Device Management</CardTitle>
//                         <CardDescription className="flex justify-center">Welcome back to your device dashboard</CardDescription>
//                     </div>
//                     <div className="flex justify-center mt-4">
//                         <Tabs defaultValue="login" className="w-[400px]">
//                             <TabsList className="grid w-full grid-cols-2">
//                                 <TabsTrigger value="login">Login</TabsTrigger>
//                                 <TabsTrigger value="register">Register</TabsTrigger>
//                             </TabsList>

//                             {/* login tab */}
//                             <TabsContent value="login">
//                                 <div className="w-full space-y-2">
//                                     <Label htmlFor="email" className="relative left-1 space-y-4">Email</Label>
//                                     <div className="relative">
//                                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="email"
//                                             type="email" 
//                                             placeholder="Enter your email" 
//                                             className='pl-10'
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                         ></Input>
//                                     </div>
//                                 </div>
//                                 <div className="w-full space-y-4">
//                                     <Label htmlFor="password" className="relative left-1 top-3">Password</Label>
//                                     <div className="relative">
//                                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="password"
//                                             type="password" 
//                                             placeholder="Enter your password" 
//                                             className='pl-10'
//                                             onChange={(e) => setPassword(e.target.value)}
//                                         ></Input>
//                                     </div>
//                                 </div>

//                                  {/* Remember Me & Forgot Password */}
//                                 <div className="flex items-center justify-between mt-4">
//                                     <div className="flex items-center space-x-2">
//                                         <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={setRememberMe} />
//                                             <label
//                                                 htmlFor="rememberMe"
//                                                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                             >
//                                                 remember me
//                                             </label>
//                                     </div>
//                                     {/* <a
//                                     href="#"
//                                     className="text-sm text-blue-500 hover:underline"
//                                     >
//                                     Forgot password?
//                                     </a> */}
//                                 </div>

//                                 <div className="w-full mt-4">
//                                     <Button className="w-full" variant="buttonBlue" onClick={handleLogin}>Log In</Button>
//                                 </div>
//                             </TabsContent>

//                             {/* Register tab */}
//                             <TabsContent value="register">
//                                 <div className="w-full space-y-2">
//                                     <Label htmlFor="username" className="relative left-1 space-y-4">username</Label>
//                                     <div className="relative">
//                                         <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="username"
//                                             type="username" 
//                                             placeholder="Choose a username" 
//                                             className='pl-10'
//                                         ></Input>
//                                     </div>
//                                 </div>
//                                 <div className="w-full space-y-4">
//                                     <Label htmlFor="email" className="relative left-1 top-3">Email</Label>
//                                     <div className="relative">
//                                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="email"
//                                             type="email" 
//                                             placeholder="Enter your email" 
//                                             className='pl-10'
//                                         ></Input>
//                                     </div>
//                                 </div>
//                                 <div className="w-full space-y-4">
//                                     <Label htmlFor="password" className="relative left-1 top-3">Password</Label>
//                                     <div className="relative">
//                                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="password"
//                                             type="password" 
//                                             placeholder="Create your password" 
//                                             className='pl-10'
//                                         ></Input>
//                                     </div>
//                                 </div>
//                                 <div className="w-full space-y-4">
//                                     <Label htmlFor="confirmPassword" className="relative left-1 top-3">Confirm Password</Label>
//                                     <div className="relative">
//                                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//                                         <Input
//                                             id="confirmPassword"
//                                             type="confirmPassword" 
//                                             placeholder="Confirm your password" 
//                                             className='pl-10'
//                                         ></Input>
//                                     </div>
//                                 </div>

//                                 <div className="w-full space-y-4">
//                                 <Label htmlFor="confirmPassword" className="relative left-1 top-3">Role</Label>
//                                 <RadioGroup defaultValue="user" className="flex space-x-6">
//                                     <div className="flex items-center space-x-2">
//                                     <RadioGroupItem value="user" id="user" />
//                                     <Label htmlFor="user">User</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                     <RadioGroupItem value="admin" id="admin" />
//                                     <Label htmlFor="admin">Admin</Label>
//                                     </div>
//                                 </RadioGroup>
//                                 </div>

//                                 <div className="w-full mt-4">
//                                     <Button className="w-full" variant="buttonBlue">Register</Button>
//                                 </div>
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                 </CardHeader>
//             </Card>
//         </div>
        
//     )
// }

// export default Login


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component imports
import { Button } from "@/components/ui/button";

// Icon imports
import { Mail, Lock, CircleUser } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Checkbox } from "@/components/ui/checkbox.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginApiError, setLoginApiError] = useState("");

  // Register-only state
  const [userName, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  // Validation error states for register
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  // State for forgot password modal and inline validation
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState("");

  // A basic email regex for demonstration purposes
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // On mount, check for remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Login handler with API endpoint
  const handleLogin = async () => {
    setLoginApiError("");
    if (!email || !password) {
      setLoginApiError("Please enter your email and password.");
      return;
    }

    // Remember me
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginApiError(
          errorData.message || "Login failed. Please check your credentials."
        );
      } else {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/mydevices");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginApiError("An error occurred, please try again later.");
    }
  };

  // Validate register email (inline validation)
  const validateRegisterEmail = (value) => {
    setRegisterEmail(value);
    if (value && !emailPattern.test(value)) {
      setRegisterEmailError("Please enter a valid email address");
    } else {
      setRegisterEmailError("");
    }
  };

  // Validate that the register passwords match (inline validation)
  const validatePasswordMatch = (value) => {
    setConfirmPassword(value);
    if (registerPassword && value !== registerPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleRegisterPasswordChange = (value) => {
    setRegisterPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  // Register handler with API endpoint
  const handleRegister = async () => {
    if (!emailPattern.test(registerEmail)) {
      setRegisterEmailError("Please enter a valid email address");
      return;
    }
    if (registerPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    const registrationData = {
      userName,
      email: registerEmail,
      password: registerPassword,
      role,
    };

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || "Registration failed");
      } else {
        const data = await response.json();
        console.log("User created successfully:", data);
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setApiError("An error occurred, please try again later.");
    }
  };

  // Validate forgot password email for inline error feedback
  const validateForgotPasswordEmail = (value) => {
    setForgotPasswordEmail(value);
    if (value && !emailPattern.test(value)) {
      setForgotPasswordEmailError("Please enter a valid email address");
    } else {
      setForgotPasswordEmailError("");
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
   

      <Card className="w-full max-w-[650px]">
        <CardHeader>
          <div>
            <CardTitle className="text-3xl font-bold flex justify-center">
              Device Management
            </CardTitle>
            <CardDescription className="flex justify-center">
              Welcome back to your device dashboard
            </CardDescription>
          </div>
          <div className="flex justify-center mt-4">
            <Tabs defaultValue="login" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <div className="w-full space-y-2">
                  <Label htmlFor="email" className="relative left-1">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full space-y-4 mt-4">
                  <Label htmlFor="password" className="relative left-1">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {loginApiError && (
                  <p className="text-red-500 text-xs mt-1">{loginApiError}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none"
                    >
                      Remember me
                    </label>
                  </div>
                  
                </div>

                <div className="w-full mt-4">
                  <Button
                    className="w-full"
                    variant="buttonBlue"
                    onClick={handleLogin}
                  >
                    Log In
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <div className="w-full space-y-2">
                  <Label htmlFor="username" className="relative left-1">
                    Username
                  </Label>
                  <div className="relative">
                    <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      className="pl-10"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full space-y-2 mt-4">
                  <Label htmlFor="registerEmail" className="relative left-1">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => validateRegisterEmail(e.target.value)}
                      onBlur={(e) => validateRegisterEmail(e.target.value)}
                    />
                  </div>
                  {registerEmailError && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerEmailError}
                    </p>
                  )}
                </div>
                <div className="w-full space-y-2 mt-4">
                  <Label
                    htmlFor="registerPassword"
                    className="relative left-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Create your password"
                      className="pl-10"
                      value={registerPassword}
                      onChange={(e) =>
                        handleRegisterPasswordChange(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="w-full space-y-2 mt-4">
                  <Label
                    htmlFor="confirmPassword"
                    className="relative left-1"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => validatePasswordMatch(e.target.value)}
                      onBlur={(e) => validatePasswordMatch(e.target.value)}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
                <div className="w-full space-y-4 mt-4">
                  <Label htmlFor="role" className="relative left-1">
                    Role
                  </Label>
                  <RadioGroup
                    defaultValue="user"
                    className="flex space-x-6"
                    onValueChange={(value) => setRole(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="User" id="user" />
                      <Label htmlFor="user">User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Admin" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                  </RadioGroup>
                </div>
                {apiError && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    {apiError}
                  </p>
                )}
                <div className="w-full mt-4">
                  <Button
                    className="w-full"
                    variant="buttonBlue"
                    onClick={handleRegister}
                  >
                    Register
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default Login;
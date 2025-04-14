import React from "react";
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Donut from "../components/PieChart";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockDeviceInventory = [
    { id: "DEV-2025-001", name: "MacBook Pro M3", type: "Laptop", status: "in-use", assignedTo: "james.wilson@company.com" },
    { id: "DEV-2025-002", name: "iPhone 15 Pro", type: "Mobile", status: "available", assignedTo: "" },
    { id: "DEV-2025-003", name: "Dell XPS 15", type: "Laptop", status: "retired", assignedTo: "" },
];

const mockDevice = [
    { name: "MacBook Pro M2", type: "laptop", borrowed: "2025-03-14 09:30 AM" },
    { name: "iPhone 15 Pro", type: "mobile", borrowed: "2025-03-14 10:15 AM" },
    { name: "Dell XPS 15", type: "laptop", borrowed: "2025-03-13 05:45 PM" },
    { name: "iPad Pro 2024", type: "tablet", borrowed: "2025-03-14 11:20 AM" },
    { name: "Surface Laptop Studio", type: "laptop", borrowed: "2025-03-14 08:55 AM" },
    { name: "Samsung Galaxy S25", type: "mobile", borrowed: "2025-03-12 03:30 PM" },
  ];

const deviceDistribution = [
    { name: "Laptop", value: 3 },
    { name: "Mobile", value: 2 },
    { name: "Tablet", value: 1 },
];

function AdminDevice() {
    const [showMyDeviceList, setShowMyDeviceList] = useState(false);

    // for inventory list
    const [myDeviceList, setMyDeviceList] = useState(mockDevice);


    // for personal devices
    const [inventoryDeviceList, setInventoryDeviceList] = useState(mockDeviceInventory);
    const [distribution, setDistribution] = useState(deviceDistribution);
    const [searchedDevice, setSearchedDevice] = useState("");

    return (<h1>welcome back admin</h1>)
}


export default AdminDevice;


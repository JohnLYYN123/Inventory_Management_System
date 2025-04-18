import React from "react";
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Donut from "../components/PieChart";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";


import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea} from "@/components/ui/textarea";

import { Pencil, ArchiveRestore } from "lucide-react";

const mockDeviceInventory = [
    { id: "1", name: "MacBook Pro M3", type: "Laptop", status: "in-use", assignedTo: "james.wilson@company.com" },
    { id: "2", name: "iPhone 15 Pro", type: "Mobile", status: "available", assignedTo: "" },
    { id: "3", name: "Dell XPS 15", type: "Laptop", status: "retired", assignedTo: "" },
    { id: "4", name: "MacBook Pro M3", type: "Laptop", status: "pending", assignedTo: "james.wilson@company.com" },
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
    const [searchedDevice, setSearchedDevice] = useState("");

    // for inventorys devices
    const [inventoryDeviceList, setInventoryDeviceList] = useState("");
    const [newInventoryDevice, setNewInventoryDevice] = useState("");
    const [mode, setMode] = useState("all");

    // for new inventory device dialog
    const [showNewDeviceDialog, setShowNewDeviceDialog] = useState(false);
    const [newDeviceInfo, setNewDeviceInfo] = useState({
        id: "",
        name:"", 
        type: "",
        status: "available", 
        assignedTo: ""
    });

    // For edit device info
    const [editDeviceDialog, setEditDeviceDialog] = useState(false);
    const [editDeviceInfo, setEditDeviceInfo] = useState({});
    const [uploadFile, setUploadFile] = useState(null);
    const [adminComment, setAdminComment] = useState("");

    // For device return dialog
    const [returnDeviceDialog, setReturnDeviceDialog] = useState(false);
    const [returnDeviceInfo, setReturnDeviceInfo] = useState({});

    // for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const modeData = Array.isArray(inventoryDeviceList)
      ? (mode === "all" ? inventoryDeviceList : inventoryDeviceList.filter(item => item.status === mode.toLowerCase()))
          .slice()
          .sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime))
      : [];

    const filteredInventory = modeData?.filter((device) =>
        device.name.toLowerCase().includes(searchedDevice.toLowerCase())
    );

    // pagination calculations
    const total = Math.ceil(filteredInventory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

    const userInfo = JSON.parse(localStorage.getItem("user")).data.identity;
    const token = JSON.parse(localStorage.getItem("user")).data.token;
    useEffect(() => {
        // fetch device list
        try{

        } catch (error) {
            
        }
        setCurrentPage(1);
      }, [mode, inventoryDeviceList]);
      

    const handleAddingNewDevice = async () => {
        const newId = Number(inventoryDeviceList[inventoryDeviceList.length - 1].id) + 1;
        setNewDeviceInfo({ ...newDeviceInfo, device_id: newId });
        const device = {
            id: String(newId), 
            name: newDeviceInfo.name,
            type: newDeviceInfo.type,
            status: newDeviceInfo.status,
            assignedTo: newDeviceInfo.assignedTo,
          };
        
        setInventoryDeviceList(prev => [...prev, device]);
        setNewDeviceInfo({
            name:"", 
            type: "",
            status: "available", 
            assignedTo: ""
        });
        setShowNewDeviceDialog(false);
    }

    const handleReturnDevice = async () => {
        setInventoryDeviceList(prev => 
            prev.map(req => 
                req.id === editDeviceInfo.id ? editDeviceInfo : req
            )
        );
        setEditDeviceDialog(false);
    }

    


    return (
        <div className="px-10 py-3">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold mt-4">Inventory Device List</h1>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="justify-front mb-4 gap-2">
                            <div>
                                <Input
                                placeholder="Search devices..."
                                className="w-80"
                                type="text"
                                value={searchedDevice}
                                onChange={(e) => setSearchedDevice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {["all", "Available", "In-Use", "Pending" ,"Retired"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setMode(f)}
                                className={`px-4 py-1 rounded-md border ${
                                mode === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                            ))}
                        </div>
                        <div className="w-1/6 h-10 justify-end mb-4">
                                <Dialog open={showNewDeviceDialog} onOpenChange={setShowNewDeviceDialog}>
                                    <Button variant="buttonBlue" className="w-full" onClick={() => setShowNewDeviceDialog(true)}> 
                                        + New Device
                                    </Button>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Adding a New Device</DialogTitle>
                                            <DialogDescription>Please fill in the information of the new device</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-3">
                                            <Label htmlFor="deviceName">Device Name</Label>
                                            <Input 
                                                id="deviceName"
                                                value={newDeviceInfo.name}
                                                onChange={(e) => setNewDeviceInfo({ ...newDeviceInfo, name: e.target.value })}
                                                placeholder="Please enter device name"
                                            />
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <Label htmlFor="deviceType">Device Type</Label>
                                            <Select onValueChange={(value) => setNewDeviceInfo({ ...newDeviceInfo, type: value })}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a device type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="laptop">Laptop</SelectItem>
                                                    <SelectItem value="mobile">Mobile</SelectItem>
                                                    <SelectItem value="tablet">Tablet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <Label htmlFor="deviceStatus">Device Status</Label>
                                            <Select onValueChange={(value) => setNewDeviceInfo({ ...newDeviceInfo, status: value })}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a device status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="in-use">In Use</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="retired">Retired</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <Label htmlFor="assignedTo">Assigned To</Label>
                                            <Input 
                                                id="assignedTo"
                                                value={newDeviceInfo.assignedTo}
                                                onChange={(e) => setNewDeviceInfo({ ...newDeviceInfo, assignedTo: e.target.value })}
                                                placeholder="Please enter the email of the person assigned to this device"
                                            />
                                        </div>

                                        <DialogFooter className="flex justify-end gap-2 mt-4">
                                            <Button variant="ghost" onClick={() => setShowNewDeviceDialog(false)}>Cancel</Button>
                                            <Button variant="buttonBlue" onClick={() => {handleAddingNewDevice();}}>
                                                Add
                                            </Button>
                                        </DialogFooter>   
                                    </DialogContent>
                                </Dialog>  
                        </div>
                    </div>
                    <table className="min-w-full table-auto boarder-collapse">
                        {/* table row heads */}
                        <thead>
                            <tr className="text-left text-sm font-semibold text-gray-700 border-b">
                                <th className="p-3">Device ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Assigned To</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        {/* table stuffing */}
                        <tbody>
                            {paginatedInventory.map((req) => (
                                <tr key={req.id} className="text-sm border-b hover:bg-gray-50">
                                    <td className="p-3">{req.id}</td>
                                    <td className="p-3">{req.name}</td>
                                    <td className="p-3">{req.type}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === "available" ? "bg-green-100 text-green-800" : req.status === "in-use" ? "bg-yellow-100 text-yellow-800" : req.status === "pending" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{req.assignedTo}</td>
                                    <td className="p-3 flex items-center gap-2">
                                        <Pencil 
                                            size={18}
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => {
                                                setEditDeviceInfo({...req});
                                                setEditDeviceDialog(true);
                                                }   
                                            }
                                        />

                                        {/* On for those devices that are in in-use mode */}
                                        {req.status === "in-use" && (
                                            <ArchiveRestore 
                                                size={18}
                                                className="text-green-500 cursor-pointer"
                                                onClick={() => {
                                                    setReturnDeviceDialog(true);
                                                    setReturnDeviceInfo({...req});
                                                }}
                                            />
                                        )}
                                    </td>   

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {total > 1 && (
                        <Pagination className="mt-5 justify-center items-center">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        className={currentPage !== 1 ? "" : "opacity-40" }
                                    />
                                </PaginationItem>

                                <PaginationItem>
                                     <span className="text-sm text-muted-foreground px-3">
                                        Page {currentPage} of {total}
                                    </span>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage((p) => Math.max(p + 1, 1))}
                                        className={currentPage !== total ? "" : "opacity-40" }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                    {editDeviceDialog && (
                        <Dialog open={editDeviceDialog} onOpenChange={setEditDeviceDialog}>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Editing Device</DialogTitle>
                            <DialogDescription>Please be cautious the upcoming operations</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Label htmlFor="deviceName">Device Name: </Label>
                                <div className="text-md font-sm">{editDeviceInfo.name}</div>

                                <Label htmlFor="deviceType">Device Type: </Label>
                                <div className="text-md font-sm">{editDeviceInfo.type}</div>

                                <Label htmlFor="deviceStatus">Device Status: </Label>
                                <Select value={editDeviceInfo.status} onValueChange={(value) => 
                                        setEditDeviceInfo(prev => ({...prev,
                                        status: value,
                                        assignedTo: value === "in-use" ? prev.assignedTo : ""
                                    }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a device status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="in-use">In Use</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="retired">Retired</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Label htmlFor="assignedTo">Assigned To: </Label>
                                <Input
                                    value={editDeviceInfo.assignedTo}
                                    onChange={(e) => setEditDeviceInfo({ ...editDeviceInfo, assignedTo: e.target.value })}
                                    placeholder={
                                        (editDeviceInfo.status === "in-use" || editDeviceInfo.status=="pending") ?
                                        "Please enter the email of the person assigned to this device" :
                                        "Assigned to feature is DISABLED for the current device status"
                                    }
                                    disabled={(editDeviceInfo.status !== "in-use" || editDeviceInfo.status !== "pending")}
                                />
                            </div>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setEditDeviceDialog(false)}>Cancel</Button>
                            <Button variant="buttonBlue" onClick={() => {handleEditDevice();}}>
                                Save
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    )}
                    {returnDeviceDialog && (
                        <Dialog open={returnDeviceDialog} onOpenChange={setReturnDeviceDialog}>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Returning Device</DialogTitle>
                            <DialogDescription>You are about to return a device, please proceed with caution</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Label htmlFor="deviceName">Device Name: </Label>
                                <div className="text-md font-sm">{returnDeviceInfo.name}</div>

                                <Label htmlFor="deviceType">Device Type: </Label>
                                <div className="text-md font-sm">{returnDeviceInfo.type}</div>

                                <Label htmlFor="deviceStatus">Device Status: </Label>
                                <div className="text-md font-sm text-red-500">Changing to Available</div>
                                <div>
                                    <Label className="text-md font-medium">Admin Upload Support Files:</Label>
                                    <Input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                    />
                                    {uploadFile && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Selected: <strong>{uploadFile.name}</strong>
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-md font-medium">Admin Comment:</Label>
                                    <Textarea
                                        placeholder="Please enter your comment here" 
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        value={adminComment}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setReturnDeviceDialog(false)}>Cancel</Button>
                            <Button variant="buttonBlue" onClick={() => {handleReturnDevice();}}>
                                Save
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    )}
                </div>
        </div>

    );
}


export default AdminDevice;


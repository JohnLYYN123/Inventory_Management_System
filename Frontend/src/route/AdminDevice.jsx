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
import { toast } from "sonner";

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
        deviceName:"", 
        deviceType: "",
        status: "Available", 
    });
    const [newDeviceType, setNewDeviceType] = useState("");

    // For edit device info
    const [editDeviceDialog, setEditDeviceDialog] = useState(false);
    const [editDeviceInfo, setEditDeviceInfo] = useState({});
    const [uploadFile, setUploadFile] = useState(null);
    const [adminComment, setAdminComment] = useState("");

    // For device return dialog
    const [returnDeviceDialog, setReturnDeviceDialog] = useState(false);
    const [returnDeviceInfo, setReturnDeviceInfo] = useState([]);
    
    // for device types
    const [deviceTypeList, setDeviceTypeList] = useState([]);
    const [deviceTypeMap, setDeviceTypeMap] = useState({});
    const [deviceTypeMap2, setDeviceTypeMap2] = useState({});
    

    // for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const userInfo = JSON.parse(localStorage.getItem("user")).data.identity;
    const token = JSON.parse(localStorage.getItem("user")).data.token;
    useEffect(() => {
        //fetch device types
        const fetchDeviceTypes = async () => {
            try{
                const response = await fetch(`http://localhost:3000/api/devicetype`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                console.log("response", response);
                if (!response.ok) {
                    throw new Error("Failed to fetch device types");
                }
                const data = await response.json();
                console.log("device Type data", data);
                setDeviceTypeList(data.data);

                // converting device types list to a map 

                const deviceTypeMapObj = {};
                const deviceTypeMapObj2 = {};
                for (let i = 0; i < data.data.length; i++) {
                    const item = await data.data[i];
                    deviceTypeMapObj[item.id] = item.deviceTypeName;
                    deviceTypeMapObj2[item.deviceTypeName] = item.id;
                }
                console.log("device Type map", deviceTypeMapObj);
                

                setDeviceTypeMap(deviceTypeMapObj);
                setDeviceTypeMap2(deviceTypeMapObj2);
                console.log("map object", deviceTypeMap);
            } catch (error) {
                console.error("Error fetching device device Types", error);
            }
        };

        // fetch device list
        const fetchDevices = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/inventory`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                console.log("response", response);
                if (!response.ok) {
                    throw new Error("Failed to fetch requests");
                }
                const data = await response.json();
                console.log("data", data);
                setInventoryDeviceList(data.data);
            }
            catch (error) {
                console.error("Error fetching devices:", error);
            }
        };
        setCurrentPage(1); 
        fetchDeviceTypes();
        fetchDevices();
      }, []);

      const modeData = Array.isArray(inventoryDeviceList)
        ? (mode === "all" ? inventoryDeviceList : inventoryDeviceList.filter(item => item.status.toLowerCase() === mode.toLowerCase()))
            .slice()
            .sort((a, b) => Number(b.id) - Number(a.id))
        : [];

    const filteredInventory = modeData?.filter((device) =>
        device?.deviceName?.toLowerCase().includes(searchedDevice.toLowerCase())
    );

    // pagination calculations
    const total = Math.ceil(filteredInventory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

    const isReturnDisabled = !uploadFile || !adminComment;
    const isAddDeviceDisabled = !newDeviceInfo.deviceName || !newDeviceInfo.deviceType || !newDeviceInfo.status;


    const getDeviceTypes = async () => {
        try{
            const response = await fetch(`http://localhost:3000/api/devicetype`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("response", response);
            if (!response.ok) {
                throw new Error("Failed to fetch device types");
            }
            const data = await response.json();
            console.log("device Type data", data);
            setDeviceTypeList(data.data);

            // converting device types list to a map 

            const deviceTypeMapObj = {};
            const deviceTypeMapObj2 = {};
            for (let i = 0; i < data.data.length; i++) {
                const item = await data.data[i];
                deviceTypeMapObj[item.id] = item.deviceTypeName;
                deviceTypeMapObj2[item.deviceTypeName] = item.id;
            }
            console.log("device Type map", deviceTypeMapObj);
            

            setDeviceTypeMap(deviceTypeMapObj);
            setDeviceTypeMap2(deviceTypeMapObj2);

            console.log("map object", deviceTypeMap);
        } catch (error) {
            console.error("Error fetching device device Types", error);
        }
    };

    const handleAddingNewDevice = async () => {
        const deviceInfo = {
            deviceName: newDeviceInfo.deviceName,
            status: "Available",
            deviceType: newDeviceInfo.deviceType, 
            deviceTypeId: deviceTypeMap2[newDeviceInfo.deviceType]   
        }
        
        try{
            const response = await fetch(`http://localhost:3000/api/inventory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(deviceInfo)
            });
            
            if (!response.ok || response.status !== 201) {
                throw new Error("Failed to fetch device types");
            }

            const inventoryResponse = await fetch(`http://localhost:3000/api/inventory`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!inventoryResponse.ok) {
                throw new Error("Failed to fetch requests");
            }
            const data = await inventoryResponse.json();

            
            toast.success("Successfully added a new device");
            setInventoryDeviceList(data.data);

        }catch (error){
            console.error(error);
            toast.error("add new device failed");
        }
        setNewDeviceInfo({
            deviceName:"", 
            deviceType: "",
            status: "Available",
        });
        setShowNewDeviceDialog(false);
    }

    const handleEditDevice = async () => {
        // edit the device
        console.log("editDeviceInfo", editDeviceInfo);
        try{
            if(editDeviceInfo.status === "Retired"){
                const retireInfo = {
                    adminId: userInfo.id, 
                    comment: "Retiring inventory device"
                };
                const response = await fetch(`http://localhost:3000/api/inventory/${editDeviceInfo.id}/retire`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(retireInfo)
                });

                if(!response.ok){
                    toast.error("Failed to retire device");
                    throw new Error("Failed to retire a device");
                }

                const data = await response.json();
                console.log("handleEditdevice", data);
                toast.success("Successfully RETIRED a device");
            }
            else{
                const updateInfo = {
                    deviceName: editDeviceInfo.deviceName,
                    deviceTypeId: editDeviceInfo.deviceTypeId,
                    status: editDeviceInfo.status
                };
                const response = await fetch(`http://localhost:3000/api/inventory/${editDeviceInfo.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updateInfo)
                });

                if(!response.ok){
                    toast.error("Failed to update device");
                    throw new Error("Failed to update a device");
                }
            }

            // get all inventories 
            const inventoryResponse = await fetch(`http://localhost:3000/api/inventory`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!inventoryResponse.ok) {
                throw new Error("Failed to fetch requests");
            }
            const data = await inventoryResponse.json();
            console.log("data", data);
            toast.success("Successfully updated a device");
            setInventoryDeviceList(data.data);
        } catch (error) {
            console.error(error);
        }
        setEditDeviceInfo("");
        setEditDeviceDialog(false);
    }
    

    const handleReturnDevice = async () => {
        const returnInfo = {
            deviceId: returnDeviceInfo.id,
            userId: userInfo.id, 
            comment: adminComment
        };
        try {
            const response = await fetch(`http://localhost:3000/api/transaction/${returnDeviceInfo.id}/return`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(returnInfo)
            });

            if(!response.ok){
                toast.error("Failed to update device");
                throw new Error("Failed to update a device");
            }

            const transaction = await response.json();
            console.log("transaction", transaction);
            const transactionId = transaction.data.id;
            const formdata = new FormData();
            formdata.append("file", uploadFile);
            // begin uploading supporting image
            toast.success("uploading photos ... ");
            const uploadResponse = await fetch(`http://localhost:3000/api/transaction/upload/${transaction.data.deviceId}/${transactionId}/Return`, {
                method: "POST",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                body: formdata
            });
            
            console.log("upload Resposne", uploadResponse);
            if (!uploadResponse.ok) {
                if(uploadResponse.status === 400){
                    toast.error("Image must be at least 250 x 250 resolution");
                }
                else{
                    throw new Error("Support file transimision failed");
                }
            }
            else if(uploadResponse.status === 200){
                toast.success("Image has been uploaded successfully");
                toast.success("Successfully returned a device");
            }
            else{
                throw new Error("Image trannsmission failed");
            }

            const inventoryResponse = await fetch(`http://localhost:3000/api/inventory`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!inventoryResponse.ok) {
                throw new Error("Failed to fetch requests");
            }
            const data = await inventoryResponse.json();
            setInventoryDeviceList(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Error happened during returning the current device");
        }
        setAdminComment("");
        setUploadFile(null);
        setReturnDeviceDialog(false);
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
                            {["all", "Available", "Unavailable", "Pending" ,"Retired"].map((f) => (
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
                                    <Button variant="buttonBlue" className="w-full" onClick={() => {getDeviceTypes(); setShowNewDeviceDialog(true);}}> 
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
                                                value={newDeviceInfo.deviceName}
                                                onChange={(e) => setNewDeviceInfo({ ...newDeviceInfo, deviceName: e.target.value })}
                                                placeholder="Please enter device name"
                                            />
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <Label htmlFor="deviceType">Device Type</Label>
                                            <div className="flex items-center gap-2">
                                                <Select onValueChange={(value) => setNewDeviceInfo({ ...newDeviceInfo, deviceType: value })}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a device type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {deviceTypeList.map((type) => (
                                                            <SelectItem key={type.id} value={type.deviceTypeName}>
                                                            {type.deviceTypeName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button variant="" className="whitespace-nowrap" onClick={() => alert("TODO: Add new type dialog")}>
                                                    + Add Device Type
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <Label htmlFor="deviceStatus">Device Status</Label>
                                            <div className="flex items-center gap-2">
                                                <Select onValueChange={(value) => setNewDeviceInfo({ ...newDeviceInfo, status: value })}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a device status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="available">Available</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                
                                            </div>
                                        </div>

                                        <DialogFooter className="flex justify-end gap-2 mt-4">
                                            <Button variant="ghost" onClick={() => setShowNewDeviceDialog(false)}>Cancel</Button>
                                            <Button variant="buttonBlue" onClick={() => {handleAddingNewDevice();}} disabled={isAddDeviceDisabled}>
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
                                    <td className="p-3">{req.deviceName}</td>
                                    <td className="p-3">{deviceTypeMap[req.deviceTypeId]}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === "Available" ? "bg-green-100 text-green-800" : req.status === "Unavailable" ? "bg-yellow-100 text-yellow-800" : req.status === "Pending" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{req.deviceUser?.userName ? `${req.deviceUser.userName} (${req.deviceUser.email})`: "-"}</td>
                                    <td className="p-3 flex items-center gap-2">
                                        <Pencil 
                                            size={18}
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => {
                                                setEditDeviceInfo(req);
                                                setEditDeviceDialog(true);
                                                }   
                                            }
                                        />

                                        {/* On for those devices that are in in-use mode */}
                                        {req.status === "Unavailable" && (
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
                                <div className="text-md font-sm">{editDeviceInfo.deviceName}</div>

                                <Label htmlFor="deviceType">Device Type: </Label>
                                <div className="text-md font-sm">{deviceTypeMap[editDeviceInfo.deviceTypeId]}</div>

                                <Label htmlFor="deviceStatus">Device Status: </Label>
                                <div className="text-sm font-md text-red-500">Options for Unavailable and Pending are disabled, view Requests Management for more details</div>
                                <Select
                                    value={editDeviceInfo.status}
                                    onValueChange={(value) => {
                                        setEditDeviceInfo(prev => ({
                                        ...prev,
                                        status: value,
                                        }))
                                    }}
                                    disabled={["Unavailable", "Pending"].includes(editDeviceInfo.status)}
                                    >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a device status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Unavailable" disabled>Unavailable</SelectItem>
                                        <SelectItem value="Retired">Retired</SelectItem>
                                        <SelectItem value="Pending" disabled>Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setEditDeviceDialog(false)}>Cancel</Button>
                            <Button variant="buttonBlue" onClick={() => {handleEditDevice();}} disabled={["Unavailable", "Pending"].includes(editDeviceInfo.status)}>
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
                            <DialogDescription className="text-red-500">You are about to return a device, please proceed with caution</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Label htmlFor="deviceName">Device Name: </Label>
                                <div className="text-md font-sm">{returnDeviceInfo.deviceName}</div>

                                <Label htmlFor="deviceType">Device Type: </Label>
                                <div className="text-md font-sm">{deviceTypeMap[returnDeviceInfo.deviceTypeId]}</div>

                                <Label htmlFor="deviceStatus">Device Status: </Label>
                                <div className="text-md font-sm">{returnDeviceInfo.status} <div className="text-md font-sm text-red-500">(Changing to Available)</div></div>
                                
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
                            <Button variant="ghost" onClick={() => {setReturnDeviceDialog(false); setAdminComment(""); setUploadFile(null);}}>Cancel</Button>
                            <Button variant="buttonBlue" onClick={() => {handleReturnDevice();}} disabled={isReturnDisabled}>
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


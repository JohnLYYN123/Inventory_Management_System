import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";

const statusIcon = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  denied: "bg-red-100 text-red-700",
};

const mockData = [
  { id: 1, status: "pending", date: "2025-03-14", device: "MacBook Pro M3", info: "goog" },
  { id: 2, status: "completed", date: "2025-03-13", device: "iPhone 15 Pro", info: "goog" },
  { id: 3, status: "denied", date: "2025-03-12", device: "Dell XPS 15", info: "goog" },
  { id: 4, status: "completed", date: "2025-04-12", device: "De1 SOC", info: "goog" },
  { id: 5, status: "completed", date: "2025-04-12", device: "OMG", info: "goog" },
  { id: 6, status: "completed", date: "2025-04-12", device: "Testing Kit", info: "goog" },
];

function RequestManagement() {
  // Used for filter buttons (all, pending, completed, rejected).
  const [mode, setMode] = useState("all");
  const [requests, setRequests] = useState(mockData);
  const [page, setPage] = useState(1); // For pagination
  const [curEditRequest, setCurEditRequest] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);

  // New Request Dialog state
  const [newDevice, setNewDevice] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [newRequestInfo, setNewRequestInfo] = useState("");
  // State to control the visibility of the device dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestIdPrefix = "REQ_";

  // Filter requests based on selected mode.
  const modeData = (mode === "all" ? requests : requests.filter(item => item.status === mode))
  .slice()
  .sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime));

  // identity related data
  const userInfo = JSON.parse(localStorage.getItem("user")).data.identity;
  const token = JSON.parse(localStorage.getItem("user")).data.token;

  // pagination calculations
  const total = Math.ceil(modeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequest = modeData.slice(startIndex, endIndex);

  const handleWithdraw = async (id) => {
    console.log("Withdrawing request with ID:", id);
    try{
      const response = await fetch(`http://localhost:3000/api/request/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to withdraw request");
        throw new Error("Failed to withdraw request");
      }

      const data = await response.json();
      console.log("Request withdrawn successfully:", data);
      toast.success("Request withdrawn successfully!");

      // fetch the updated requests list from the server
      const updatedResponse = await fetch(`http://localhost:3000/api/request?requestorId=${userInfo.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated requests");
      }
      const updatedData = await updatedResponse.json();
      console.log("Updated requests data:", updatedData);

      setRequests(updatedData.data);
    } catch (error) {
      console.error("Error withdrawing request:", error);
    }
    setShowDialog(false);
  };


  // handle save edit request
  const handleSaveEdit = async () => {
    console.log("Saving edited request:", curEditRequest);
    try{
      const response = await fetch(`http://localhost:3000/api/request/${curEditRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestDetail: curEditRequest.requestDetail,
          deviceId: curEditRequest.device.id,
          requestorId: userInfo.id
        }),
      });

      if (!response.ok) {
        toast.error("Failed to update request");
        throw new Error("Failed to update request");
      }

      const data = await response.json();
      console.log("Request updated successfully:", data);
      toast.success("Request updated successfully!");

      // fetch the updated requests list from the server
      const updatedResponse = await fetch(`http://localhost:3000/api/request?requestorId=${userInfo.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated requests");
      }
      const updatedData = await updatedResponse.json();
      console.log("Updated requests data:", updatedData);

      setRequests(updatedData.data);
    } catch (error) {
      console.error("Error saving edited request:", error);
    }
    setShowDialog(false);
  };

  const addNewRequest = async () => {
    console.log("Adding new request:", newDevice, newRequestInfo, deviceId);
    const newRequest = {
      requestorId: parseInt(userInfo.id),
      deviceId: parseInt(deviceId),
      requestDetail: newRequestInfo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        toast.error("Failed to create request");
        throw new Error("Failed to create request");
      }

      const data = await response.json();
      console.log("New request created:", data);
      toast.success("New request created successfully!");

      // fetch the updated requests list from the server
      const updatedResponse = await fetch(`http://localhost:3000/api/request?requestorId=${userInfo.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated requests");
      }
      const updatedData = await updatedResponse.json();
      console.log("Updated requests data:", updatedData);

      setRequests(updatedData.data);

      setNewDevice("");
      setNewRequestInfo("");
    } catch (error) {
      console.error("Error creating new request:", error);
    }
  }

  useEffect(() => {
    // fetch all requests from the server
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/request?requestorId=${userInfo.id}`, {
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
        setRequests(data.data);
      }
      catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    setCurrentPage(1);
    fetchRequests();
  }, []);

  // === Device Search Dropdown for New Request ===

  // Dummy data for available devices.
  // In production, replace this dummy data with an API call to fetch available devices
  // using a code snippet similar to the commented code below.
  const dummyAvailableDevices = [
    { id: 1, name: "MacBook Pro M3" },
    { id: 2, name: "Dell XPS 15" },
    { id: 3, name: "iPhone 15 Pro" },
    { id: 4, name: "iPad Pro 2024" },
    { id: 5, name: "Surface Laptop Studio" }
  ];

  //Production Version:
  
  
  // useEffect(() => {
  //   const fetchAvailableDevices = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/api/available-devices?search=${encodeURIComponent(newDevice)}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch available devices");
  //       }
  //       const data = await response.json();
  //       setAvailableDevices(data);
  //     } catch (error) {
  //       console.error("Error fetching available devices:", error);
  //     }
  //   };
  //   if (newDevice) {
  //     fetchAvailableDevices();
  //     setShowDropdown(true);
  //   }
  // }, [newDevice]);
  useEffect(() => {
    const controller = new AbortController();
  
    const fetchAvailableDevices = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory?deviceName=${encodeURIComponent(newDevice)}&status=Available`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available devices");
        }
        const data = await response.json();
        console.log("Available devices data:", data);
        setAvailableDevices(data.data); // assuming backend returns { data: [...] }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching available devices:", error);
        }
      }
    };
  
    if (newDevice) {
      const debounce = setTimeout(() => {
        fetchAvailableDevices();
        setShowDropdown(true);
      }, 300);
  
      return () => {
        clearTimeout(debounce);
        controller.abort();
      };
    }
  }, [newDevice]);
  
  
  
  // Using dummy data for now.
  const filteredAvailableDevices = availableDevices.filter(device =>
    device.deviceName.toLowerCase().includes(newDevice.toLowerCase())
  );

  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mt-4">Request Management</h1>
        <div className="w-1/6">
          <Dialog open={newRequestDialog} onOpenChange={setNewRequestDialog}>
            <Button
              className="w-full"
              variant="buttonBlue"
              onClick={() => {
                setNewRequestDialog(true);
                // When opening, clear previous search/dropdown state if needed.
                setShowDropdown(true);
              }}
            >
              + New Request
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Request</DialogTitle>
                <DialogDescription>
                  Fill in the request details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="device">Device</Label>
                <div className="relative">
                  <Input
                    id="device"
                    value={newDevice}
                    onChange={(e) => {
                      setNewDevice(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search available devices..."
                  />
                  {showDropdown && newDevice && (
                    filteredAvailableDevices.length > 0 ? (
                      <div className="absolute z-50 bg-white border w-full max-h-40 overflow-y-auto mt-1">
                        {filteredAvailableDevices.map(device => (
                          <div
                            key={device.id}
                            onClick={() => {
                              setNewDevice(device.deviceName); // Set the selected device name in the input field.
                              setDeviceId(device.id); // Set the selected device ID.
                              setShowDropdown(false); // Hide the dropdown upon selection.
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            {device.deviceName}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="absolute z-50 bg-white border w-full mt-1 p-2 text-red-500 text-xs">
                        No matching device found.
                      </div>
                    )
                  )}
                </div>
                <Label htmlFor="info">Detailed Description</Label>
                <Input
                  id="info"
                  value={newRequestInfo}
                  onChange={(e) => setNewRequestInfo(e.target.value)}
                  placeholder="Please enter your reason for requesting the device"
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setNewRequestDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="buttonBlue"
                  onClick={() => {
                    addNewRequest();
                    setNewRequestDialog(false);
                  }}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["all", "Pending", "Completed", "Denied"].map((f) => (
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
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-sm font-semibold text-gray-700 border-b">
            <th className="p-3">Request ID</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3">Device</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequest.map((req) => (
            <tr key={req.id} className="text-sm border-b hover:bg-gray-50">
              <td className="p-3">{req.id}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusIcon[req.status.toLowerCase()]}`}>
                  {req.status.toLowerCase()}
                </span>
              </td>
              <td className="p-3">{req.requestTime}</td>
              <td className="p-3">{req.device.deviceName}</td>
              <td className="p-3 flex items-center gap-2">
                {req.status.toLowerCase() === "pending" && (
                  <Pencil
                    size={18}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      console.log("Edit request:", req);
                      setCurEditRequest(req);
                      setShowDialog(true);
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
      {curEditRequest && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit / Withdraw Request</DialogTitle>
              <DialogDescription>Please be cautious with the upcoming operations</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Label htmlFor="Device">Device</Label>
              <Textarea
                value={curEditRequest.device.deviceName}
                onChange={(e) =>
                  setCurEditRequest({ ...curEditRequest, device: e.target.value })
                }
                readOnly
                placeholder="Device"
              />
              <Label htmlFor="Info">Detailed Description of Request</Label>
              <Input
                value={curEditRequest.requestDetail}
                onChange={(e) =>
                  setCurEditRequest({ ...curEditRequest, requestDetail: e.target.value })
                }
                placeholder="Info"
              />
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => handleSaveEdit()}>
                Save
              </Button>
              <Button variant="destructive" onClick={() => handleWithdraw(curEditRequest.id)}>
                Withdraw
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default RequestManagement;

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";

const statusIcon = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const mockData = [
  { id: 1, status: "pending", date: "2025-03-14", device: "MacBook Pro M3", info: "goog" },
  { id: 2, status: "completed", date: "2025-03-13", device: "iPhone 15 Pro", info: "goog" },
  { id: 3, status: "rejected", date: "2025-03-12", device: "Dell XPS 15", info: "goog" },
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

  // New Request Dialog state
  const [newDevice, setNewDevice] = useState("");
  const [newRequestInfo, setNewRequestInfo] = useState("");
  // State to control the visibility of the device dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const requestIdPrefix = "REQ_";

  // Filter requests based on selected mode.
  const modeData = mode === "all" ? requests : requests.filter(item => item.status === mode);

  // pagination calculations
  const total = Math.ceil(modeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequest = modeData.slice(startIndex, endIndex);

  const handleWithdraw = async (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    setShowDialog(false);
  };

  const handleSaveEdit = async () => {
    setRequests(prev =>
      prev.map(req =>
        req.id === curEditRequest.id ? curEditRequest : req
      )
    );
    setShowDialog(false);
  };

  const addNewRequest = async () => {
    const newId = Math.max(...requests.map(r => r.id)) + 1;
    const newRequest = {
      id: newId,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      device: newDevice,
      info: newRequestInfo,
    };
    setRequests([...requests, newRequest]);
    setNewDevice("");
    setNewRequestInfo("");
  };

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

  /* Production Version:
  const [availableDevices, setAvailableDevices] = useState([]);
  
  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/available-devices?search=${encodeURIComponent(newDevice)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch available devices");
        }
        const data = await response.json();
        setAvailableDevices(data);
      } catch (error) {
        console.error("Error fetching available devices:", error);
      }
    };
    if (newDevice) {
      fetchAvailableDevices();
      setShowDropdown(true);
    }
  }, [newDevice]);
  */
  
  // Using dummy data for now.
  const filteredAvailableDevices = dummyAvailableDevices.filter(device =>
    device.name.toLowerCase().includes(newDevice.toLowerCase())
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
                              setNewDevice(device.name);
                              setShowDropdown(false); // Hide the dropdown upon selection.
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            {device.name}
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
                  variant="default"
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
        {["all", "pending", "completed", "rejected"].map((f) => (
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
              <td className="p-3">{requestIdPrefix + req.id}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusIcon[req.status]}`}>
                  {req.status}
                </span>
              </td>
              <td className="p-3">{req.date}</td>
              <td className="p-3">{req.device}</td>
              <td className="p-3 flex items-center gap-2">
                {req.status === "pending" && (
                  <Pencil
                    size={18}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
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
              <Input
                value={curEditRequest.device}
                onChange={(e) =>
                  setCurEditRequest({ ...curEditRequest, device: e.target.value })
                }
                placeholder="Device"
              />
              <Label htmlFor="Info">Detailed Description of Request</Label>
              <Input
                value={curEditRequest.info}
                onChange={(e) =>
                  setCurEditRequest({ ...curEditRequest, info: e.target.value })
                }
                placeholder="Info"
              />
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSaveEdit}>
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

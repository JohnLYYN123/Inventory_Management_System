import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Pencil, X } from "lucide-react";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationNext, 
    PaginationPrevious } from "@/components/ui/pagination";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"

const statusIcon = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

const mockData = [
    { id: 1, status: "pending", date: "2025-03-14", device: "MacBook Pro M3", info: "goog"},
    { id: 2, status: "completed", date: "2025-03-13", device: "iPhone 15 Pro",info: "goog" },
    { id: 3, status: "rejected", date: "2025-03-12", device: "Dell XPS 15",info: "goog" },
    { id: 4, status: "completed", date: "2025-04-12", device: "De1 SOC" ,info: "goog"},
    { id: 5, status: "completed", date: "2025-04-12", device: "OMG",info: "goog" },
    { id: 6, status: "completed", date: "2025-04-12", device: "Testing Kit",info: "goog" },
  ];

function RequestManagement(){
    // used for the buttons of all, pending, completed, rejected 
    const [mode, setMode] = useState("all");
    const [requests, setRequests] = useState(mockData);
    const [page, setPage] = useState(1); // used for 
    const [curEditRequest, setCurEditRequest] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newRequestDialog, setNewRequestDialog] = useState(false);
    const [newDevice, setNewDevice] = useState("");
    const [newRequestInfo, setNewRequestInfo] = useState("");

    const requestIdPrefix = 'REQ_'

    const itemPerPage = 3;
    const pageCount = Math.ceil(requests.length / itemPerPage);
    const curRequest = requests.slice((page - 1) * itemPerPage, page * itemPerPage);

    const modeData = mode === "all" ? requests : requests.filter(item=> item.status === mode);

    const handleWithdraw = (id) => {
        setRequests(prev => prev.filter(req => req.id !== id));
        setShowDialog(false);
      };
    
    const handleSaveEdit = () => {
    setRequests(prev =>
        prev.map(req =>
        req.id === curEditRequest.id ? curEditRequest : req
        )
    );
    setShowDialog(false);
    };

    const addNewRequest = () => {
        const newId = Math.max(...requests.map(r => r.id)) + 1;
        
        const newRequest = {
            id: newId, 
            status: "pending",
            date: new Date().toISOString().split("T")[0], 
            device: newDevice, 
            info: newRequestInfo
        }
        setRequests([...requests, newRequest]);
        setNewDevice("");
        setNewRequestInfo("");
    };


    return(
        <div className="px-10 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mt-4">Request Management</h1>
                <div className="w-1/6">
                    <Dialog open={newRequestDialog} onOpenChange={setNewRequestDialog}>
                        <Button className="w-full" variant="buttonBlue" onClick={() => setNewRequestDialog(true)}>+ New Request</Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Request</DialogTitle>
                                <DialogDescription>Fill in the request details below</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Label htmlFor="device">Device</Label>
                                <Input value={newDevice} onChange={(e) => setNewDevice(e.target.value)} placeholder="Please enter device information" />
                                <Label htmlFor="info">Detailed Description</Label>
                                <Input value={newRequestInfo} onChange={(e) => setNewRequestInfo(e.target.value)} placeholder="Please enter your reason of request the device" />
                            </div>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                                <Button variant="ghost" onClick={() => setNewRequestDialog(false)}>Cancel</Button>
                                <Button variant="default" onClick={() => {addNewRequest(); setNewRequestDialog(false);}}>Add</Button>
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
            <table className="min-w-full table-auto boarder-collapse">
                {/* table row heads */}
                <thead>
                    <tr className="text-left text-sm font-semibold text-gray-700 border-b">
                        <th className="p-3">Request ID</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Device</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                {/* table stuffing */}
                <tbody>
                    {modeData.map((req) => (
                        <tr key={req.id} className="text-sm border-b hover:bg-gray-50">
                            <td className="p-3">{requestIdPrefix + req.id}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusIcon[req.status]}`}
                                >
                                    {req.status}
                                </span>
                            </td>
                            <td className="p-3">{req.date}</td>
                            <td className="p-3">{req.device}</td>
                            <td className="p-3 flex items-center gap-2">
                                <Pencil 
                                    size={18}
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => {
                                            setCurEditRequest(req);
                                            setShowDialog(true);
                                        }   
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            {curEditRequest && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit / Withdraw Request</DialogTitle>
                    <DialogDescription>Please be cautious the upcoming operations</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                    <Label htmlFor="Device">Device</Label>
                    <Input
                        value={curEditRequest.device}
                        onChange={(e) => setCurEditRequest({ ...curEditRequest, device: e.target.value })}
                        placeholder="Device"
                    />
                    <Label htmlFor="Info">Detailed Description of Request</Label>
                    <Input
                        value={curEditRequest.info}
                        onChange={(e) => setCurEditRequest({ ...curEditRequest, info: e.target.value })}
                        placeholder="Info"
                    />
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => setShowDialog(false)}>Cancel</Button>
                    <Button variant="default" onClick={handleSaveEdit}>Save</Button>
                    <Button variant="destructive" onClick={() => handleWithdraw(curEditRequest.id)}>Withdraw</Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default RequestManagement
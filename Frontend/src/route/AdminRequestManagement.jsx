import React from "react";
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Donut from "../components/PieChart";
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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

import { Pencil, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";

const mockRequestData = [
    {
      id: "1",
      device: "iPhone 15 Pro",
      requestedBy: "sophia.chan@company.com",
      date: "2025-03-14",
      reason: "Device malfunctionn",
    },
    {
      id: "2",
      device: "MacBook Pro M3",
      requestedBy: "james.wilson@company.com",
      date: "2025-03-13",
      reason: "Device update",
    },
    {
        id: "3",
        device: "MacBook Pro M3",
        requestedBy: "johnlin@mail.utoronto.ca",
        date: "2025-03-13",
        reason: "Device update",
      },
  ];
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

function AdminRequestManagement() {
    const [requestData, setRequestData] = useState([]);
    const [mode, setMode] = useState("all");
    const [requests, setRequests] = useState(mockData);
    const [curEditRequest, setCurEditRequest] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newRequestDialog, setNewRequestDialog] = useState(false);
    const [newDevice, setNewDevice] = useState("");
    const [newRequestInfo, setNewRequestInfo] = useState("");

    const [showManagementDialog, setShowManagementDialog] = useState(false);
    const [viewedRequest, setViewedRequest] = useState(null);

    const [uploadFile, setUploadFile] = useState(null);
    const [adminComment, setAdminComment] = useState("");

    // for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const requestIdPrefix = 'REQ_'

     // identity related data
     const userInfo = JSON.parse(localStorage.getItem("user")).data.identity;
     const token = JSON.parse(localStorage.getItem("user")).data.token;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/request?Requeststatus=Pending`, {
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

      const modeData = Array.isArray(requests)
      ? (mode === "all" ? requests : requests.filter(item => item.status === mode))
          .slice()
          .sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime))
      : [];

    // pagination calculations
    const total = Math.ceil((modeData?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequest = modeData.slice(startIndex, endIndex);



    const handleApproveRequest =  async (request) => {
        // passing to API submission
        // check of passed info

        console.log("request info toqub", request, uploadFile, adminComment);
        if (!uploadFile) {
            toast.error("Please upload a support file before approving");
            return;
        }

        if(!adminComment) {
            toast.error("Please enter a comment before approving.");
            return;
        }
        
        const approveInfo ={
            deviceId: request.deviceId,
            requestorId: request.requestorId,
            adminComment: adminComment
        };

        try {

            //TODO continue here
            const response = await fetch(`http://localhost:3000/api/request/${request.id}/approve`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(approveInfo)
                
              });

            if (!response.ok) {
                throw new Error("APi submission failed");
            }

            const approveData = await response.json();
            console.log("approvedata", approveData);
            if(approveData.transaction === false){
                toast.error("The requested device was already borrowed, DENIED automatically");
            }
            else{
                const transactionId = approveData.data.transaction.id;
                const formdata = new FormData();
                formdata.append("file", uploadFile);
                // begin uploading supporting image
                toast.success("uploading photos ... ");
                const uploadResponse = await fetch(`http://localhost:3000/api/transaction/upload/${approveInfo.deviceId}/${transactionId}/Borrow`, {
                    method: "POST",
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                    body: formdata
                });
                toast.success("SUCESS!!!");
                console.log("uploadResponse", updatedResponse);

                if (!uploadResponse.ok) {
                    throw new Error("Support file transimision failed");
                }
            }
            const updatedResponse = await fetch(`http://localhost:3000/api/request?Requeststatus=Pending`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        
            console.log("response", updatedResponse);
            if (!response.ok) {
                throw new Error("Failed to fetch requests");
            }
            const data = await updatedResponse.json();
            console.log("data", data);
            setRequests(data.data);

            toast.success(`Request made by ${request.requestor.userName} was approved`);
            // setRequestData(prev => prev.filter(req => req.id !== request.id));
            setUploadFile(null);
            setShowManagementDialog(false);
            setAdminComment("");
        } catch (error) {
            console.error("Error when doing submission:", error);
            toast.error("Error when doing submission. Please try again.");
            setUploadFile(null);
            setShowManagementDialog(false);
            setAdminComment("");
        }

      };
      
    const handleDeclineRequest = async (request) => {
        // only admin is commentd
        console.log("decline request", request);
        if(!adminComment) {
            toast.error("Please enter a reason before declining");
            return;
        }
        const declineInfo = {
            deviceId: request.deviceId,
            requestorId: request.requestorId,
            adminComment: adminComment
        };

        try{ 
            const response = await fetch(`http://localhost:3000/api/request/${request.id}/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(declineInfo),
            });
    
            if (!response.ok) {
                toast.error("Failed to decline request");
                throw new Error("Failed to decline request");
            }

            // fetch a new list of request again
            const updatedResponse = await fetch(`http://localhost:3000/api/request?Requeststatus=Pending`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                });
        
                console.log("response", updatedResponse);
                if (!response.ok) {
                throw new Error("Failed to fetch requests");
                }
                const data = await updatedResponse.json();
                console.log("data", data);
                setRequests(data.data);
            } catch (error) {
                console.error("Error declining request:", error);
            }
            
            toast.error(`Request made by ${request.requestor.userName} was declined`);
            // setRequestData(prev => prev.filter(req => req.id !== request.id));
            setShowManagementDialog(false);
            setUploadFile(null);
            setAdminComment("");
    };

    const isApproveDisabled = !uploadFile || !adminComment;
    const isDeclineDisabled = !adminComment;

  return (<div className="px-10 py-3">
              <div className="flex items-center justify-between mb-6">
                  <div className="items-center space-x-2">
                      <Label htmlFor="switch" className="text-4xl font-bold mt-4">Request Management for ADMIN</Label>
                  </div>
              </div>

               <div className="overflow x-auto">
                    <table className="min-w-full table-auto boarder-collapse">
                        <thead>
                        <tr className="text-left text-sm font-semibold text-gray-700 border-b">
                            <th className="p-3">Request ID</th>
                            <th className="p-3">Device</th>
                            <th className="p-3">Requested By</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 flex items-center justify-center gap-2">More Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedRequest && paginatedRequest.map((req) => (
                            <tr key={req.id} className="text-sm border-b hover:bg-gray-50">
                                <td className="p-3">{req.id}</td>
                                <td className="p-3">{req.device.deviceName}</td>
                                <td className="p-3">{req.requestor?.userName || "Unknown"}</td>
                                <td className="p-3">{req.requestTime}</td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Eye 
                                            size={22}
                                            className="text-blue-500 cursor-pointer hover:scale-125 transition-transform"
                                            onClick={() => {
                                                    setViewedRequest(req);
                                                    setShowManagementDialog(true);
                                                }   
                                            }
                                        />
                                    </div>
                                    
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

                    {/* more action dialog */}
                    {viewedRequest && (
                        <Dialog open={showManagementDialog} onOpenChange={setShowManagementDialog}>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>Here are the details of this request.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <div>
                                <Label className="text-md font-medium">Request ID:</Label>
                                <div className="text-md">{viewedRequest.id}</div>
                                </div>
                                <div>
                                <Label className="text-md font-medium">Device:</Label>
                                <div className="text-md">{viewedRequest.device.deviceName}</div>
                                </div>
                                <div>
                                <Label className="text-md font-medium">Requested By:</Label>
                                <div className="text-md">{viewedRequest.requestor.userName || "Unknown"}</div>
                                </div>
                                <div>
                                <Label className="text-md font-medium">Date:</Label>
                                <div className="text-md">{viewedRequest.requestTime}</div>
                                </div>
                                <div>
                                <Label className="text-md font-medium">Reason:</Label>
                                <Textarea
                                    value={viewedRequest.requestDetail}
                                    readOnly 
                                    className="text-md"
                                />
                                </div>
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
                                <Button variant="default" onClick={() => setShowManagementDialog(false)}>Close</Button>
                                <Button variant="buttonBlue" 
                                    disabled={isApproveDisabled}
                                    onClick={() => 
                                        {handleApproveRequest(viewedRequest);}
                                    }
                                >
                                    Approve Request
                                </Button>
                                <Button variant="destructive" 
                                    disabled={isDeclineDisabled}
                                    onClick={() => handleDeclineRequest(viewedRequest)}>
                                        Decline Request
                                </Button> 
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        )}
                </div>
            </div>
            )
}

export default AdminRequestManagement;
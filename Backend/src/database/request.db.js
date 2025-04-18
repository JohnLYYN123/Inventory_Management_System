const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    // Create new request
    // requestData includes:
    // - status: RequestStatus (Pending)
    // - requestorId: Int 
    // - deviceId: Int (if not available, throw an error)
    // - adminComment: string (optional) 
    // - requestDetail: string (optional)

    createRequest: async (requestData) => {
        try {
            const device = await prisma.inventory.findUnique({
                where: { id: requestData.deviceId },
            });

            if (!device) {
                throw new Error("Device not found");
            } else if (device.status !== "Available") {
                throw new Error("Device is not available")
            }

            const request = await prisma.request.create({
                data: {
                    status: "Pending",
                    requestorId: requestData.requestorId,
                    deviceId: requestData.deviceId,
                    adminComment: requestData.adminComment,
                    requestDetail: requestData.requestDetail,
                },
                include: {
                    requestor: true,
                    device: true,
                },
            });

            // updata device status
            await prisma.inventory.update({
                where: { id: request.deviceId },
                data: { status: "Pending" },
            });

            return request;
        } catch (error) {
            throw error;
        }
    },


    // Get request by Id
    getRequestById: async (id) => {
        try {
            return await prisma.request.findUnique({
                where: { id },
                include: {
                    requestor: true,
                    device: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    // Get all requests with filters
    // Include requestor and device in the response
    // filters can include:
    // - status: RequestStatus
    // - requestorId: Int 
    // - deviceId: Int
    getAllRequests: async (filters = {}) => {
        try {
            const { status, requestorId, deviceId } = filters;
            console.log("status", status);
            const whereClause = {
                status: status || undefined,
                requestorId: requestorId || undefined,
                deviceId: deviceId || undefined,
            };

            return await prisma.request.findMany({
                where: whereClause,
                include: {
                    requestor: true,
                    device: true,
                },
            });

        } catch (error) {
            throw error;
        }
    },


    // Updata request
    // To change device or requestDetail of the request
    // If device is changed, the status of new device becomes Pending, and the status of previous device becomes Available
    // The request status becomes Pending
    // requestData includes:
    // - requestDetail: string?  
    // - deviceId: Int 
    // For requestData.deviceId:
    //    - First try to find if an existing device matching id,
    //    - If not found, throw an error
    //    - If the device is not available, throw an error
    updateRequest: async (id, requestData) => {
        try {
            // Check if the request exists
            const existingRequest = await prisma.request.findUnique({
                where: { id: id },
            });
            console.log("existingRequest", existingRequest);
            if (!existingRequest) {
                throw new Error("Request not found");
            }

            const newDeviceId = requestData.deviceId;
            const oldDeviceId = existingRequest.deviceId;

            if (newDeviceId !== oldDeviceId) {
                // Check if the new device exists and available
                const newDevice = await prisma.inventory.findUnique({
                    where: { id: newDeviceId },
                });

                if (!newDevice) {
                    throw new Error("Device not found");
                } else if (newDevice.status !== "Available") {
                    throw new Error("Device is not available")
                }

                await prisma.inventory.update({
                    where: { id: oldDeviceId },
                    data: {
                        status: "Available",
                        deviceUserId: null,
                    },
                });

                await prisma.inventory.update({
                    where: { id: newDeviceId },
                    data: { status: "Pending" },
                });
            }

            // update the request
            return await prisma.request.update({
                where: { id: id },
                data: {
                    requestDetail: requestData.requestDetail || undefined,
                    deviceId: requestData.deviceId,
                    status: "Pending",
                },
                include: {
                    requestor: true,
                    device: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    // Delete request
    deleteRequest: async (id) => {
        try {
            console.log("id", id);
            return await prisma.request.delete({ where: { id: id } });
        } catch (error) {
            throw error;
        }
    },


    // Approve request
    approveRequest: async (id, req) => {
        try {
            // Check if the request exists and can be borrowed
            const request = await prisma.request.findUnique({
                where: { id },
                include: {
                    device: true,
                    requestor: true,
                },
            });

            console.log("check request",request, req);

            if (!request) {
                throw new Error("Request not found");
            }

            if (request.status !== "Pending") {
                throw new Error("Only pending requests can be approved.");
            }

            if (request.device.deviceUserId !== null){
                const autoDenyRequest = await prisma.request.update({
                    where: { id: id },
                    data: {
                        status: "Denied",
                        adminComment: "Device has been borrowed, thus automatically denied",
                    },
                    include: {
                        device: true,
                        requestor: true,
                    },
                });
                
                return { autoDenyRequest, transaction: false};
            }

            // if (request.device.status !== "Available") {
            //     throw new Error("Device is not available for borrowing.");
            // }

            // Updata request status and admin comment
            const approvedRequest = await prisma.request.update({
                where: { id: id },
                data: {
                    status: "Completed",
                    adminComment: req.adminComment,
                },
                include: {
                    device: true,
                    requestor: true,
                },
            });

            // updata device status
            await prisma.inventory.update({
                where: { id: approvedRequest.deviceId },
                data: {
                    status: "Unavailable",
                    deviceUserId: approvedRequest.requestorId,
                },
            });

            // create new transaction
            const transaction = await prisma.transaction.create({
                data: {
                    deviceId: approvedRequest.deviceId,
                    executorId: approvedRequest.requestorId,
                    activity: "Borrow",
                },
            });
            return { approvedRequest, transaction };
        } catch (error) {
            throw error;
        }
    },


    // Reject request
    rejectRequest: async (id, adminComment) => {
        try {
            // update request status and admin comment
            const rejectedRequest = await prisma.request.update({
                where: { id: id },
                data: {
                    status: "Denied",
                    adminComment: adminComment,
                },
                include: {
                    device: true,
                    requestor: true,
                },
            });

            // update inventory status
            await prisma.inventory.update({
                where: { id: rejectedRequest.deviceId },
                data: { status: "Available" },
            });

            return rejectedRequest;
        } catch (error) {
            throw error;
        }
    },
};
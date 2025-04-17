const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    // Create new inventory
    // inventoryData includes:
    // - deviceName: string  
    // - status: Status  
    // - deviceTypeId: int 
    // - deviceUserId: int?       
    createInventory: async (inventoryData) => {
        try {
            const inventory = await prisma.inventory.create({
                data: {
                    deviceName: inventoryData.deviceName,
                    status: inventoryData.status,
                    deviceTypeId: inventoryData.deviceTypeId,
                    deviceUserId: inventoryData.deviceUserId || undefined,
                },
                include: {
                    deviceType: true,
                    deviceUser: true,
                },
            });

            return inventory;
        } catch (error) {
            throw error;
        }
    },


    // Get inventory by Id
    getInventoryById: async (id) => {
        try {
            return await prisma.inventory.findUnique({
                where: { id },
                include: {
                    requests: true,
                    transactions: true,
                    deviceUser: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    // Get all inventories with filters
    // Include requests and transactions in the response
    // filters can include:
    // - deviceName: string
    // - status: Status
    // - deviceTypeId: Int
    // - deviceUserId: Int
    getAllInventories: async (filters = {}) => {
        try {
            const { deviceName, status, deviceTypeId } = filters;

            const whereClause = {
                deviceName: deviceName || undefined,
                status: status || undefined,
                deviceTypeId: deviceTypeId || undefined,
                deviceUserId: deviceUserId || undefined,
            };

            return await prisma.inventory.findMany({
                where: whereClause,
                include: {
                    requests: true,
                    transactions: true,
                    deviceUser: true,
                },
            });

        } catch (error) {
            throw error;
        }
    },


    // Updata inventory
    // inventoryData includes:
    // - deviceName: string    
    // - deviceTypeId: int 
    updateInventory: async (id, inventoryData) => {
        try {
            // Check if the inventory exist
            const existingInventory = await prisma.inventory.findUnique({
                where: { id: id },
            });

            if (!existingInventory) {
                throw new Error("Inventory not found");
            }

            // Check if the new device type exist
            const deviceType = await prisma.deviceType.findUnique({
                where: { id: inventoryData.deviceTypeId },
            });

            if (!deviceType) {
                throw new Error("DeviceType not found");
            }

            // Perform update
            const updated = await prisma.inventory.update({
                where: { id: id },
                data: {
                    deviceName: inventoryData.deviceName,
                    deviceTypeId: inventoryData.deviceTypeId,
                },
                include: {
                    deviceType: true,
                    deviceUser: true,
                    requests: true,
                    transactions: true,
                },
            });

            return updated;
        } catch (error) {
            throw error;
        }
    },


    // Retire inventory
    // - Only inventory with "Available" or "Pending" status can be retired
    // - After retiring, the inventory status will become "Retired"
    // - All pending requests for this inventory will be denyed, and transaction will be recorede.
    // Input: inventory id and admin id (user id of admin account)
    retireInventory: async (id, adminId) => {
        try {
            // Check inventory and its current status
            const inventory = await prisma.inventory.findUnique({
                where: { id: id },
                include: {
                    request: true,
                },
            });

            if (!inventory) {
                throw new Error("Inventory not found");
            }

            if (!["Available", "Pending"].includes(inventory.status)) {
                throw new Error("Inventory cannot be retired from current status");
            }

            // Deny all pending requests for this inventory
            const pendingRequests = inventory.requests.filter(r => r.status === "Pending");
            await Promise.all(
                pendingRequests.map(req =>
                    prisma.request.update({
                        where: { id: req.id },
                        data: {
                            status: "Denied",
                            adminComment: "Request denied due to inventory retirement"
                        },
                    })
                )
            );

            // Create a retirement transaction
            await prisma.transactions.create({
                data: {
                    deviceId: id,
                    executorId: adminId,
                    activity: "Retired",
                    comment: "Device retired by admin",
                }
            });


            // Update inventory status and unassign user
            const retiredInventory = await prisma.inventory.update({
                where: { id: id },
                data: {
                    status: "Retried",
                    deviceUserId: null,
                },
                include: {
                    deviceType: true,
                    requests: true,
                    transactions: true,
                },
            });

            return retiredInventory;
        } catch (error) {
            throw error;
        }
    },
};
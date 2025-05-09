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
          const { deviceName, status, deviceTypeId, deviceUserId } = filters;
          const whereClause = {
            // your existing filters, including the "contains" for deviceName
            deviceName: deviceName
              ? { contains: deviceName, mode: "insensitive" }
              : undefined,
            status: status || undefined,
            deviceTypeId: deviceTypeId ? Number(deviceTypeId) : undefined,
            deviceUserId: deviceUserId ? Number(deviceUserId) : undefined,
          };
      
          // fetch with the nested relation
          const raw = await prisma.inventory.findMany({
            where: whereClause,
            include: {
              deviceType: true,
              requests: true,
              transactions: true,
              deviceUser: true,
            },
          });
      
          // flatten out the deviceTypeName
          return raw.map((item) => ({
            ...item,
            deviceTypeName: item.deviceType.name,
          }));
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

            let deviceStatus = existingInventory.status;
            if(deviceStatus !== inventoryData.status){
                deviceStatus = inventoryData.status;
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
                    status: deviceStatus
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
    // - All pending requests for this inventory will be denyed, and transaction will be recorded.
    // Input: inventory id and admin id (user id of admin account)
    retireInventory: async (deviceId, adminId, comment) => {
        try {
            // Check inventory and its current status
            const inventory = await prisma.inventory.findUnique({
                where: { id: deviceId },
                include: {
                    requests: true,
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
            const transactionInfo = await prisma.transaction.create({
                data: {
                    deviceId: deviceId,
                    executorId: adminId,
                    activity: "Retired",
                    comment: comment,
                },
                include: {
                    executor: true,
                    device: true,
                },
            });


            // Update inventory status and unassign user
            const retiredInventory = await prisma.inventory.update({
                where: { id: deviceId },
                data: {
                    status: "Retired",
                    deviceUserId: null,
                },
                include: {
                    deviceType: true,
                    requests: true,
                    transactions: true,
                },
            });

            return {retiredInventory, transaction: transactionInfo};
        } catch (error) {
            throw error;
        }
    },
};
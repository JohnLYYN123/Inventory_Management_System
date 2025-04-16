const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    // Create new device type
    // deviceTypeData includes:
    // - deviceTypeName: string        
    createDeviceType: async (deviceTypeData) => {
        try {
            //deviceTypeName uniqueness check
            const existingDeviceType = await prisma.deviceType.findUnique({
                where: { deviceTypeName: deviceTypeData.deviceTypeName },
            });

            if (existingDeviceType) {
                throw new Error("Device Type already exist");
            }

            const deviceType = await prisma.deviceType.create({
                data: {
                    deviceTypeName: deviceTypeData.deviceTypeName,
                },
                include: {
                    inventories: true,
                },
            });

            return deviceType;
        } catch (error) {
            throw error;
        }
    },

    // Get device type by Id
    getDeviceTypeById: async (id) => {
        try {
            return await prisma.deviceType.findUnique({
                where: { id: id },
                include: { inventories: true },
            });
        } catch (error) {
            throw error;
        }
    },

    // Get all device types with filters
    // Include inventories in the response
    // filters can include:
    // - deviceTypeName: string (case-insensitive, partial match)
    getAllDeviceTypes: async (filters = {}) => {
        try {
            const { deviceTypeName } = filters;

            const whereClause = {
                deviceTypeName: deviceTypeName ? { contains: deviceTypeName, mode: "insensitive" } : undefined,
            };

            return await prisma.deviceType.findMany({
                where: whereClause,
                include: { inventories: true },
            });

        } catch (error) {
            throw error;
        }
    },

    // Update device type
    // deviceTypeData includes:
    // - deviceTypeName:  string
    // - inventories: array of inventory objects
    // For each inventory in deviceTypeData.inventories:
    //    - First try to find an existing inventory with matching id and name,
    //    - If not found, throw an error
    updateDeviceType: async (id, deviceTypeData) => {
        try {
            // deviceTypeName uniqueness check
            const existingDeviceType = await prisma.deviceType.findUnique({
                where: { deviceTypeName: deviceTypeData.deviceTypeName },
            });

            if (existingDeviceType) {
                throw new Error("Device Type already exist");
            }

            // check if inventories exist
            const inventories = await Promise.all(
                deviceTypeData.inventories.map(async (inventory) => {
                    let existingInventory = await prisma.inventory.findFirst({
                        where: {
                            id: inventory.id,
                            deviceName: inventory.deviceName,
                        },
                    });

                    if (!existingInventory) {
                        throw new error("Inventory not found");
                    }
                    return existingInventory;
                })
            );

            // updata deviceType
            return await prisma.deviceType.update({
                where: { id },
                data: {
                    deviceTypeName: deviceTypeData.deviceTypeName,
                    inventories: {
                        set: [],
                        connect: inventories.map((inv) => ({ id: inv.id })),
                    },
                },
                include: { inventories: true },
            });
        } catch (error) {
            throw error;
        }
    },


    // Delete device type
    deleteDeviceType: async (id) => {
        try {
            await prisma.deviceType.delete({ where: { id } });
        } catch (error) {
            throw error;
        }
    },
};
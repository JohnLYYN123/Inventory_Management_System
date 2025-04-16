const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    // Create new device type
    // deviceTypeData includes:
    // - deviceType: string        
    createDeviceType: async (deviceTypeData) => {
        try {
            const deviceType = await prisma.deviceType.create({
                data: {
                    deviceType: deviceTypeData.deviceType,
                }
            });

            return deviceType;
        } catch (error) {
            throw error;
        }
    },
};
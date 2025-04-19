const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    // Create new transaction
    // tsnData includes:
    // - activity: Activity
    // - deviceId: int 
    // - executorId: int
    // - comment: string?
    createTransaction: async (tsnData) => {
        try {
            const transaction = await prisma.transaction.create({
                data: {
                    activity: tsnData.activity,
                    deviceId: tsnData.deviceId,
                    executorId: tsnData.executorId,
                    comment: tsnData.comment || undefined,
                },
                include: {
                    executor: true,
                    device: true,
                },
            });

            return transaction;
        } catch (error) {
            throw error;
        }
    },


    // Get transaction by Id
    getTransactionById: async (id) => {
        try {
            return await prisma.transaction.findUnique({
                where: { id },
                include: {
                    executor: true,
                    device: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    // Get all transactions with filters
    // Include executor and device in the response
    // filters can include:
    // - activity: Activity
    // - deviceId: int 
    // - executorId: int
    getAllTransactions: async (filters = {}) => {
        try {
            const { activity, deviceId, executorId } = filters;

            const whereClause = {
                activity: activity || undefined,
                executorId: executorId || undefined,
                deviceId: deviceId || undefined,
            };

            return await prisma.transaction.findMany({
                where: whereClause,
                include: {
                    executor: true,
                    device: true,
                },
            });

        } catch (error) {
            throw error;
        }
    },

    // update the url of files in cloud storage
    updateFileUrl: async (id, fileUrl) => {
        try {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: id },
            });

            if (!existingTransaction) {
                throw new Error("Transaction not found");
            }

            return await prisma.transaction.update({
                where: { id: id },
                data: {
                    file: fileUrl,
                },
                include: {
                    executor: true,
                    device: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    // Handle return 
    handleReturn: async (deviceId, userId, comment) => {
        try {
            // Check if the device exists
            const device = await prisma.inventory.findUnique({
                where: { id: deviceId },
            });
            if (!device) {
                throw new Error("Device not found");
            }

            // Check if the user exists
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("User not found");
            }

            // update inventory table:
            // - status: Unavailable -> Available
            // - unassign from user
            await prisma.inventory.update({
                where: { id: deviceId },
                data: {
                    status: "Available",
                    deviceUserId: null,
                },
            });

            // create new transaction
            return await prisma.transaction.create({
                data: {
                    deviceId,
                    executorId: userId,
                    activity: "Return",
                    comment: comment,
                },
                include: {
                    executor: true,
                    device: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },

};
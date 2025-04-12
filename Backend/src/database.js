const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const dbOperations = {
  //----------- User Functions ----------------------

  // Register
  /*userData includes:
    - userName     
    - email       
    - department   
    - location     
    - displayName  
    - password     
    - role         
  */
  createUser: async (userData) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          userName: userData.userName,
          email: userData.email,
          department: userData.department,
          location: userData.location,
          displayName: userData.displayName,
          password: hashedPassword,
          role: userData.role,
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Get user by id
  // Include requests and transactions in the response
  getUserById: async (id) => {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          requests: true,
          transactions: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email, newPassword) => {
    try {
      const hashed = await bcrypt.hash(newPassword, 10);
      return await prisma.user.update({
        where: { email },
        data: { password: hashed },
      });
    } catch (error) {
      throw error;
    }
  },

  //----------- DeviceType Functions ----------------------

  // Get all device types with filters
  // Include inventories in the response
  // filters can include:
  // - deviceType: string (case-insensitive, partial match)
  getAllDeviceTypes: async (filters = {}) => {
    try {
      const { deviceType } = filters;

      const whereClause = {
        deviceType: deviceType ? { contains: deviceType, mode: "insensitive" } : undefined,
      };

      return await prisma.deviceType.findMany({
        where: whereClause,
        include: { inventories: true },
      });

    } catch (error) {
      throw error;
    }
  },

  // Get device type by Id
  getDeviceTypeById: async (id) => {
    try {
      return await prisma.deviceType.findUnique({
        where: { id },
        include: { inventories: true },
      });
    } catch (error) {
      throw error;
    }
  },

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

  // Update device type
  // deviceTypeData includes:
  // - deviceType:  string
  // - inventories: array of inventory objects
  // For each inventory in deviceTypeData.inventories:
  //    - First try to find an existing inventory with matching id and name,
  //    - If not found, throw an error
  updateDeviceType: async (id, deviceTypeData) => {
    try {
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

      return await prisma.deviceType.update({
        where: { id },
        data: {
          deviceType: deviceTypeData.deviceType,
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

  //----------- Inventory Functions ----------------------

  // Get all inventories with filters
  // Include requests and transactions in the response
  // filters can include:
  // - deviceName: string (case-insensitive, partial match)
  // - status: Status
  // - deviceTypeId: Int
  getAllInventories: async (filters = {}) => {
    try {
      const { deviceName, status, deviceTypeId } = filters;

      const whereClause = {
        deviceName: deviceName ? { contains: deviceName, mode: "insensitive" } : undefined,
        status: status || undefined,
        deviceTypeId: deviceTypeId || undefined,
      };

      return await prisma.inventory.findMany({
        where: whereClause,
        include: {
          requests: true,
          transactions: true,
        },
      });

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
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Create new inventory
  // inventoryData includes:
  // - deviceName: string  
  // - status: Status  
  // - deviceTypeId: int        
  createInventory: async (inventoryData) => {
    try {
      const inventory = await prisma.inventory.create({
        data: {
          deviceName: inventoryData.deviceName,
          status: inventoryData.status,
          deviceTypeId: inventoryData.deviceTypeId,
        },
        include: { deviceType: true },
      });

      return inventory;
    } catch (error) {
      throw error;
    }
  },

  // Updata inventory
  // inventoryData includes:
  // - deviceName: string  
  // - status: Status  
  // - deviceTypeId: int 
  // - requests: optional
  // - transactions: optional
  // For each item in inventoryData.deviceType/requests/transactions:
  //    - First try to find an existing item with matching id,
  //    - If not found, throw an error
  updateInventory: async (id, inventoryData) => {
    try {
      const deviceType = await prisma.deviceType.findUnique({
        where: { id: inventoryData.deviceTypeId },
      });

      if (!deviceType) {
        throw new Error("DeviceType not found");
      }

      if (inventoryData.requests) {
        await Promise.all(
          inventoryData.requests.map(async (req) => {
            const existing = await prisma.request.findUnique({
              where: { id: req.id },
            });
            if (!existing) {
              throw new Error(`Request with id ${req.id} not found.`);
            }
          })
        );
      }

      if (inventoryData.transactions) {
        await Promise.all(
          inventoryData.transactions.map(async (txn) => {
            const existing = await prisma.transaction.findUnique({
              where: { id: txn.id },
            });
            if (!existing) {
              throw new Error(`Transaction with id ${txn.id} not found.`);
            }
          })
        );
      }

      // Perform update
      const updated = await prisma.inventory.update({
        where: { id: Number(id) },
        data: {
          deviceName: inventoryData.deviceName,
          status: inventoryData.status,
          deviceTypeId: inventoryData.deviceTypeId,
          requests: inventoryData.requests
            ? {
              set: [],
              connect: inventoryData.requests.map((r) => ({ id: r.id })),
            }
            : undefined,
          transactions: inventoryData.transactions
            ? {
              set: [],
              connect: inventoryData.transactions.map((t) => ({ id: t.id })),
            }
            : undefined,
        },
        include: {
          deviceType: true,
          requests: true,
          transactions: true,
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  },

  // Delete device type
  deleteInventory: async (id) => {
    try {
      await prisma.inventory.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  },

  //----------- Request Functions ----------------------

  // Create new request
  // requestData includes:
  // - status: RequestStatus
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
          status: requestData.status,
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

      const whereClause = {
        status: status || undefined,
        requestorId: requestorId || undefined,
        deviceId: deviceId || undefined,
      };

      return await prisma.inventory.findMany({
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
  // requestData includes:
  // - requestDetail: string (optional)  
  // - deviceId: Int 
  // request status -> Pending 
  // device status: new device->Pending; previous device->Available
  // For requestData.device:
  //    - First try to find an existing item with matching id,
  //    - If not found, throw an error
  //    - If the device is not available, throw an error
  updateRequest: async (id, requestData) => {
    try {
      const existingRequest = await prisma.request.findUnique({
        where: { id: Number(id) },
      });

      if (!existingRequest) {
        throw new Error("Request not found");
      }

      const newDeviceId = requestData.deviceId;
      const oldDeviceId = existingRequest.deviceId;

      if (newDeviceId !== oldDeviceId) {
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
          data: { status: "Available" },
        });

        await prisma.inventory.update({
          where: { id: newDeviceId },
          data: { status: "Pending" },
        });
      }
      return await prisma.request.update({
        where: { id: Number(id) },
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
      await prisma.request.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  },

  // Approve request
  approveRequest: async (id, adminComment) => {
    try {
      const request = await prisma.request.update({
        where: { id: Number(id) },
        data: { status: "Completed", adminComment },
        include: { device: true },
      });
      await prisma.inventory.update({ where: { id: request.deviceId }, data: { status: "Unavailable" } });
      await prisma.transaction.create({
        data: {
          deviceId: request.deviceId,
          executorId: request.requestorId,
          activity: "Borrow",
        },
      });
      return request;
    } catch (error) {
      throw error;
    }
  },

  // Reject requet
  rejectRequest: async (id, adminComment) => {
    try {
      const request = await prisma.request.update({
        where: { id: Number(id) },
        data: { status: "Denied", adminComment },
        include: { device: true },
      });
      await prisma.inventory.update({ where: { id: request.deviceId }, data: { status: "Available" } });
      return request;
    } catch (error) {
      throw error;
    }
  },

  //----------- Transaction Functions ----------------------

  // Create new transaction
  // tsnData includes:
  // - activity: Activity
  // - deviceId: int 
  // - executorId: int
  // - comment: string (optional) 
  createTransaction: async (tsnData) => {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          activity: tsnData.activity,
          deviceId: tsnData.deviceId,
          executor: tsnData.executorId,
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
  getAllRequests: async (filters = {}) => {
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

  // Handle return 
  handleReturn: async (deviceId, userId, comment) => {
    try {
      await prisma.inventory.update({ where: { id: deviceId }, data: { status: "Available" } });
      return await prisma.transaction.create({
        data: {
          deviceId,
          executorId: userId,
          activity: "Return",
          comment,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Retire device
  retireDevice: async (deviceId, adminId, comment) => {
    try {
      await prisma.inventory.update({ where: { id: deviceId }, data: { status: "Retired" } });
      return await prisma.transaction.create({
        data: {
          deviceId,
          executorId: adminId,
          activity: "Retired",
          comment,
        },
      });
    } catch (error) {
      throw error;
    }
  },

};

module.exports = {
  ...dbOperations,
};
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

module.exports = {
    // Register
    // userData includes:
    // - userName  string  (unique) 
    // - email     string  (unique)  
    // - department   string? 
    // - location     string? 
    // - displayName  string? 
    // - password     string 
    // - role         Role

    createUser: async (userData) => {
        try {
            //email uniqueness check
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingUser) {
                throw new Error("Email already registered");
            }

            // hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // create user
            const user = await prisma.user.create({
                data: {
                    userName: userData.userName,
                    email: userData.email,
                    department: userData.department,
                    location: userData.location,
                    displayName: userData.displayName,
                    password: hashedPassword,
                    role: userData.role,
                },
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });

            return user;
        } catch (error) {
            throw error;
        }
    },


    // Get user by id
    // Include requests, transactions and inventories in the response
    getUserById: async (id) => {
        try {
            return await prisma.user.findUnique({
                where: { id: id },
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    // Get user by email
    // Include requests, transactions and inventories in the response
    getUserByEmail: async (email) => {
        try {
            return await prisma.user.findUnique({
                where: { email: email },
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    // get all users with filters
    // filters can include:
    // - email: string (exactly match)
    // - role: Role
    getAllUsers: async (filters = {}) => {
        try {
            const { email, role } = filters;

            const whereClause = {
                email: email || undefined,
                role: role || undefined,
            };

            return await prisma.user.findMany({
                where: whereClause,
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    // Change user profile
    // userData includes:
    // - userName  string  (unique) 
    // - email     string  (unique)  
    // - department   string? 
    // - location     string? 
    // - displayName  string? 
    updateUserProfile: async (id, userData) => {
        try {
            // userName uniqueness check
            if (userData.userName) {
                const existingUserName = await prisma.user.findUnique({
                    where: { userName: userData.userName },
                });
                if (existingUserName && existingUserName.id !== id) {
                    throw new Error("Username already in use");
                }
            }

            // email uniqueness check
            if (userData.email) {
                const existingEmail = await prisma.user.findUnique({
                    where: { email: userData.email },
                });
                if (existingEmail && existingEmail.id != id) {
                    throw new Error("Email already in use");
                }
            }

            // update the user profile
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: {
                    userName: userData.userName,
                    email: userData.email,
                    department: userData.department ?? undefined,
                    location: userData.location ?? undefined,
                    displayName: userData.displayName ?? undefined,
                },
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });

            return updatedUser;
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
                include: {
                    requests: true,
                    transactions: true,
                    inventories: true,
                },
            });
        } catch (error) {
            throw error;
        }
    },

};
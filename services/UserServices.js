const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

class UserService {
    static async createUser(username, email, password, userType) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await prisma.user.create({
                data: { username, email, password: hashedPassword, userType },
            });
        } catch (error) {
            throw new Error("Error creating user: " + error.message);
        }
    }

    static async getAllUsers() {
        return await prisma.user.findMany();
    }

    static async getUserById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }

    static async updateUser(id, data) {
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) throw new Error("User not found");

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await prisma.user.update({ where: { id }, data });
    }

    static async deleteUser(id) {
        return await prisma.user.delete({ where: { id } });
    }
}

module.exports = UserService;

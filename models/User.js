const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

class User {
    constructor(username, email, password, userType) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    async register() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        return prisma.user.create({
            data: {
                username: this.username,
                email: this.email,
                password: hashedPassword,
                userType: this.userType,
            },
        });
    }

    static async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }

    static async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
}

module.exports = User;

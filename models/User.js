const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ethers = require("ethers");

class User {
    constructor(username, walletAddress) {
        this.username = username;
        this.walletAddress = walletAddress;
    }

    // Connect wallet and create/update user profile
    static async connectWallet(walletAddress, signature, nonce, username) {
        // Verify the signature to ensure it's really coming from the wallet owner
        const isValid = await User.verifySignature(walletAddress, signature, nonce);
        
        if (!isValid) {
            throw new Error("Invalid wallet signature");
        }
        
        // Check if user with this wallet exists
        const existingUser = await User.findByWalletAddress(walletAddress);
        
        if (existingUser) {
            // Return existing user
            return existingUser;
        } else {
            // Create new user
            return prisma.user.create({
                data: {
                    username,
                    walletAddress,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            });
        }
    }

    // Verify MetaMask signature
    static async verifySignature(walletAddress, signature, nonce) {
        try {
            // The message that was signed
            const message = `Connect to LedgerVest with nonce: ${nonce}`;
            
            // Recover the address from the signature
            const recoveredAddress = ethers.utils.verifyMessage(message, signature);
            
            // Check if the recovered address matches the claimed wallet address
            return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
        } catch (error) {
            console.error("Signature verification error:", error);
            return false;
        }
    }

    static async findByWalletAddress(walletAddress) {
        return prisma.user.findUnique({ 
            where: { walletAddress } 
        });
    }

    static async findById(id) {
        return prisma.user.findUnique({ 
            where: { id } 
        });
    }
}

module.exports = User;

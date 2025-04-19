// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password, username, walletAddress } = await request.json();

    if (!email || !password || !username || !walletAddress) {
        return NextResponse.json(
            { message: 'Username, email, password, and wallet address are required' },
            { status: 400 }
        );
    }

    // Basic validation for wallet address format (optional but recommended)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
         return NextResponse.json({ message: 'Invalid wallet address format' }, { status: 400 });
    }

    try {
        // Check for existing user by email, username, or wallet address
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username },
                    { walletAddress: walletAddress },
                ],
            },
        });

        if (existingUser) {
            let message = 'Registration failed.';
            if (existingUser.email === email) message = 'Email already registered.';
            else if (existingUser.username === username) message = 'Username already exists.';
            else if (existingUser.walletAddress === walletAddress) message = 'Wallet address already linked to another account.';
            return NextResponse.json({ message }, { status: 409 }); // 409 Conflict
        }

        const hashedPassword = await hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                walletAddress: walletAddress, // Save wallet address
                authMethod: 'credentials', // Indicate registration method
                contactInfo: '', // Add default or leave empty
            },
        });
        return NextResponse.json(
            { message: 'User registered successfully. Please log in.' },
            { status: 201 } // 201 Created
        );
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { message: 'Error registering user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
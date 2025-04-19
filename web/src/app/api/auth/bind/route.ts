// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/app/api/auth/bind/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password, username, walletAddress } = await request.json();

    if (!email || !password || !username || !walletAddress) {
        return NextResponse.json(
            { message: 'Username, email, password, and wallet address are required' },
            { status: 400 }
        );
    }

    // Basic validation for wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
         return NextResponse.json({ message: 'Invalid wallet address format' }, { status: 400 });
    }

    try {
        // Check if wallet address is already used by *another* user
        const existingWalletUser = await prisma.user.findUnique({
          where: { walletAddress: walletAddress },
        });
        if (existingWalletUser && existingWalletUser.email !== email) {
          return NextResponse.json({ message: 'Wallet address already linked to another account.' }, { status: 409 });
        }

        // Find the user by email (should exist from OAuth flow)
        let user = await prisma.user.findUnique({ where: { email } });

        const hashedPassword = await hash(password, 10);

        if (user) {
            // User exists (from OAuth), update with password, username, and wallet
            if (user.password) {
               // This case should ideally not happen if the flow is correct,
               // but handle it defensively. Maybe they tried binding twice.
               return NextResponse.json({ message: 'Account already fully registered.' }, { status: 400 });
            }
            // Check if username is taken by someone else
            const existingUsernameUser = await prisma.user.findUnique({ where: { username } });
            if (existingUsernameUser && existingUsernameUser.email !== email) {
                return NextResponse.json({ message: 'Username already exists.' }, { status: 409 });
            }

            user = await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    username: username,
                    walletAddress: walletAddress,
                    authMethod: 'oauth_bound', // Indicate OAuth + bound credentials
                },
            });
        } else {
            // This case is less likely if the OAuth callback created the user stub,
            // but handle it just in case: create a new user directly.
            // Check if username is taken
            const existingUsernameUser = await prisma.user.findUnique({ where: { username } });
            if (existingUsernameUser) {
                return NextResponse.json({ message: 'Username already exists.' }, { status: 409 });
            }
            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    walletAddress: walletAddress,
                    authMethod: 'oauth_bound',
                    contactInfo: '',
                },
            });
        }

        return NextResponse.json({ message: 'Account linked successfully' }, { status: 200 });

    } catch (error) {
        console.error('Binding Error:', error);
        // Handle potential Prisma unique constraint errors more specifically if needed
        return NextResponse.json({ message: 'Error linking account' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
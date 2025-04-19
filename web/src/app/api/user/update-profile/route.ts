// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/app/api/user/update-profile/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if needed
import { hash, compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { username, currentPassword, newPassword } = await request.json();
    const userEmail = session.user.email;

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updates: { username?: string; password?: string } = {};

        // --- Handle Username Update ---
        if (username && username !== user.username) {
            // Check if new username is already taken
            const existingUsername = await prisma.user.findUnique({
                where: { username: username },
            });
            if (existingUsername && existingUsername.email !== userEmail) {
                return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
            }
            updates.username = username;
        }

        // --- Handle Password Update ---
        if (newPassword && currentPassword) {
            // Verify current password
            if (!user.password) {
                // Should not happen if user registered with credentials, but handle defensively
                return NextResponse.json({ message: 'Cannot change password for this account type without a current password set.' }, { status: 400 });
            }
            const isCurrentPasswordValid = await compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
            }
            // Hash the new password
            updates.password = await hash(newPassword, 10);
        } else if (newPassword && !currentPassword) {
             // This case should be caught by frontend validation, but double-check
             return NextResponse.json({ message: 'Current password required to set a new password' }, { status: 400 });
        }

        // --- Apply Updates ---
        if (Object.keys(updates).length > 0) {
            await prisma.user.update({
                where: { email: userEmail },
                data: updates,
            });
            return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'No changes detected' }, { status: 200 }); // Or 400 if you prefer
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
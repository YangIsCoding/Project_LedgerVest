import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password } = await request.json();
    if (!email || !password) {
        return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return NextResponse.json({ message: "User not found or not eligible for linking" }, { status: 400 });
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ message: "Password incorrect" }, { status: 401 });
        }
        // Update the user record to mark it as linked to OAuth.
        await prisma.user.update({
            where: { email },
            data: { authMethod: "oauth" },
        });
        return NextResponse.json({ message: "Account linked successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error linking account" }, { status: 500 });
    }
}
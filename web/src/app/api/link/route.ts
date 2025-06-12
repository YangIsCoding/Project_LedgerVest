import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ message: "Linking not supported anymore" }, { status: 410 }); // 410 Gone → 表示這功能已廢除
}

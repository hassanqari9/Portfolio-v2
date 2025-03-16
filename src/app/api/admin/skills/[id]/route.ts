import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }
    
    await prisma.skill.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
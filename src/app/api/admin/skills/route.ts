import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        level: data.level || 0,
        category: data.category || "Other"
      }
    });
    
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
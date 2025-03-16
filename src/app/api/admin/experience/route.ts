import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' }
    });
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
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
    if (!data.company || !data.position) {
      return NextResponse.json({ error: "Company and position are required" }, { status: 400 });
    }
    
    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        position: data.position,
        location: data.location || "",
        description: data.description || "",
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.current || false,
        logo: data.logo || ""
      }
    });
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
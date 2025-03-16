import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: Fetch about data
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const about = await prisma.about.findFirst();
    
    return NextResponse.json(about);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create about data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    // Check if about data already exists
    const existingAbout = await prisma.about.findFirst();
    
    if (existingAbout) {
      // Update existing record
      const updatedAbout = await prisma.about.update({
        where: { id: existingAbout.id },
        data: {
          title: data.title,
          description: data.description,
          image: data.image,
        },
      });
      
      return NextResponse.json(updatedAbout);
    } else {
      // Create new record
      const newAbout = await prisma.about.create({
        data: {
          title: data.title,
          description: data.description,
          image: data.image,
        },
      });
      
      return NextResponse.json(newAbout);
    }
  } catch (error) {
    console.error("Error creating about data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update about data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.title || !data.description) {
      return NextResponse.json({ error: "ID, title, and description are required" }, { status: 400 });
    }
    
    const updatedAbout = await prisma.about.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
      },
    });
    
    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error("Error updating about data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
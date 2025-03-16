import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const contact = await prisma.contact.findFirst();
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
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
    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const contact = await prisma.contact.create({
      data: {
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || ""
      }
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const existingContact = await prisma.contact.findFirst();
    
    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    
    const contact = await prisma.contact.update({
      where: { id: existingContact.id },
      data: {
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || ""
      }
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
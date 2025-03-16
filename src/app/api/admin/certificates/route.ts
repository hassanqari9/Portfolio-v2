import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const certificates = await prisma.certificate.findMany({
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
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
    if (!data.title || !data.issuer) {
      return NextResponse.json({ error: "Title and issuer are required" }, { status: 400 });
    }
    
    const certificate = await prisma.certificate.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        description: data.description || "",
        date: new Date(data.date),
        link: data.link || ""
      }
    });
    
    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 
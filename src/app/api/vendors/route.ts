import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { vendorSchema } from "@/types/vendor";

// In-memory storage for demo purposes
// In a real application, this would be a database
let vendors: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ vendors });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = vendorSchema.parse(body);
    
    const newVendor = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    vendors.push(newVendor);
    
    return NextResponse.json({ vendor: newVendor }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
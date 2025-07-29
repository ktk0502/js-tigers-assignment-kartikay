import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { vendorSchema } from "@/types/vendor";
import { createVendor, getVendorsByUserId, createOrGetUser } from "@/lib/vendor-db";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user
    const userId = await createOrGetUser(
      session.user.email,
      session.user.name || undefined,
      session.user.image || undefined
    );

    // Get vendors for this user
    const vendors = await getVendorsByUserId(userId);
    
    return NextResponse.json({ vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = vendorSchema.parse(body);
    
    // Get or create user
    const userId = await createOrGetUser(
      session.user.email,
      session.user.name || undefined,
      session.user.image || undefined
    );
    
    // Create vendor in database
    const newVendor = await createVendor(validatedData, userId);
    
    return NextResponse.json({ vendor: newVendor }, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    
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
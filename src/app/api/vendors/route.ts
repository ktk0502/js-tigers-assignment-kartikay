import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { vendorSchema } from "@/types/vendor";
import { createVendor, getVendorsByUserId, createOrGetUser, getVendorsCount } from "@/lib/vendor-db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get or create user
    const userId = await createOrGetUser(
      session.user.email,
      session.user.name || undefined,
      session.user.image || undefined
    );

    // Get vendors for this user with pagination
    const vendors = await getVendorsByUserId(userId, limit, offset);
    const total = await getVendorsCount(userId);
    
    return NextResponse.json({ 
      vendors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
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
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { vendorSchema } from "@/types/vendor";
import { getVendorById, updateVendor, deleteVendor, createOrGetUser } from "@/lib/vendor-db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = parseInt(params.id);
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
    }

    // Get or create user
    const userId = await createOrGetUser(
      session.user.email,
      session.user.name || undefined,
      session.user.image || undefined
    );

    // Get vendor by ID
    const vendor = await getVendorById(vendorId, userId);
    
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = parseInt(params.id);
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
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
    
    // Update vendor in database
    const updatedVendor = await updateVendor(vendorId, validatedData, userId);
    
    if (!updatedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    
    return NextResponse.json({ vendor: updatedVendor });
  } catch (error) {
    console.error("Error updating vendor:", error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = parseInt(params.id);
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
    }

    // Get or create user
    const userId = await createOrGetUser(
      session.user.email,
      session.user.name || undefined,
      session.user.image || undefined
    );
    
    // Delete vendor from database
    const deleted = await deleteVendor(vendorId, userId);
    
    if (!deleted) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
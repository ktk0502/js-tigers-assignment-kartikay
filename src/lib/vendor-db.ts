import pool from './db';
import { VendorFormData, Vendor } from '@/types/vendor';

export interface VendorWithUser extends Vendor {
  user_id: number;
}

// Create a new vendor
export async function createVendor(vendorData: VendorFormData, userId: number): Promise<VendorWithUser> {
  const query = `
    INSERT INTO vendors (
      vendor_name, bank_account_no, bank_name, 
      address_line_1, address_line_2, city, country, zip_code, user_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 
      id,
      vendor_name as "vendorName",
      bank_account_no as "bankAccountNo",
      bank_name as "bankName",
      address_line_1 as "addressLine1",
      address_line_2 as "addressLine2",
      city,
      country,
      zip_code as "zipCode",
      user_id as "user_id",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  
  const values = [
    vendorData.vendorName,
    vendorData.bankAccountNo,
    vendorData.bankName,
    vendorData.addressLine1 || null,
    vendorData.addressLine2,
    vendorData.city || null,
    vendorData.country || null,
    vendorData.zipCode || null,
    userId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Get all vendors for a user with pagination
export async function getVendorsByUserId(userId: number, limit: number = 10, offset: number = 0): Promise<VendorWithUser[]> {
  const query = `
    SELECT 
      id,
      vendor_name as "vendorName",
      bank_account_no as "bankAccountNo",
      bank_name as "bankName",
      address_line_1 as "addressLine1",
      address_line_2 as "addressLine2",
      city,
      country,
      zip_code as "zipCode",
      user_id as "user_id",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM vendors 
    WHERE user_id = $1 
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
}

// Get total count of vendors for a user
export async function getVendorsCount(userId: number): Promise<number> {
  const query = `
    SELECT COUNT(*) as count
    FROM vendors 
    WHERE user_id = $1
  `;
  
  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count);
}

// Get a single vendor by ID
export async function getVendorById(vendorId: number, userId: number): Promise<VendorWithUser | null> {
  const query = `
    SELECT 
      id,
      vendor_name as "vendorName",
      bank_account_no as "bankAccountNo",
      bank_name as "bankName",
      address_line_1 as "addressLine1",
      address_line_2 as "addressLine2",
      city,
      country,
      zip_code as "zipCode",
      user_id as "user_id",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM vendors 
    WHERE id = $1 AND user_id = $2
  `;
  
  const result = await pool.query(query, [vendorId, userId]);
  return result.rows[0] || null;
}

// Update a vendor
export async function updateVendor(
  vendorId: number, 
  vendorData: VendorFormData, 
  userId: number
): Promise<VendorWithUser | null> {
  const query = `
    UPDATE vendors SET
      vendor_name = $1,
      bank_account_no = $2,
      bank_name = $3,
      address_line_1 = $4,
      address_line_2 = $5,
      city = $6,
      country = $7,
      zip_code = $8
    WHERE id = $9 AND user_id = $10
    RETURNING 
      id,
      vendor_name as "vendorName",
      bank_account_no as "bankAccountNo",
      bank_name as "bankName",
      address_line_1 as "addressLine1",
      address_line_2 as "addressLine2",
      city,
      country,
      zip_code as "zipCode",
      user_id as "user_id",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  
  const values = [
    vendorData.vendorName,
    vendorData.bankAccountNo,
    vendorData.bankName,
    vendorData.addressLine1 || null,
    vendorData.addressLine2,
    vendorData.city || null,
    vendorData.country || null,
    vendorData.zipCode || null,
    vendorId,
    userId
  ];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

// Delete a vendor
export async function deleteVendor(vendorId: number, userId: number): Promise<boolean> {
  const query = `
    DELETE FROM vendors 
    WHERE id = $1 AND user_id = $2
  `;
  
  const result = await pool.query(query, [vendorId, userId]);
  return (result.rowCount ?? 0) > 0;
}

// Create or get user
export async function createOrGetUser(email: string, name?: string, image?: string): Promise<number> {
  // First try to get existing user
  let query = 'SELECT id FROM users WHERE email = $1';
  let result = await pool.query(query, [email]);
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  // Create new user if not exists
  query = `
    INSERT INTO users (email, name, image) 
    VALUES ($1, $2, $3) 
    RETURNING id
  `;
  
  result = await pool.query(query, [email, name, image]);
  return result.rows[0].id;
} 
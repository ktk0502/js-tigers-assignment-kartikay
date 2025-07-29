import { z } from "zod";

export const vendorSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  bankAccountNo: z.string().min(1, "Bank account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().min(1, "Address line 2 is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export interface Vendor extends VendorFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, type VendorFormData } from "@/types/vendor";
import { useState } from "react";

interface VendorFormProps {
  onSubmit: (data: VendorFormData) => void;
  isLoading?: boolean;
}

export default function VendorForm({ onSubmit, isLoading = false }: VendorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  const onFormSubmit = async (data: VendorFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting vendor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Vendor</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Name - Required */}
          <div className="md:col-span-2">
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Name *
            </label>
            <input
              {...register("vendorName")}
              type="text"
              id="vendorName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vendorName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter vendor name"
            />
            {errors.vendorName && (
              <p className="mt-1 text-sm text-red-600">{errors.vendorName.message}</p>
            )}
          </div>

          {/* Bank Account No - Required */}
          <div>
            <label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account No. *
            </label>
            <input
              {...register("bankAccountNo")}
              type="text"
              id="bankAccountNo"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bankAccountNo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter bank account number"
            />
            {errors.bankAccountNo && (
              <p className="mt-1 text-sm text-red-600">{errors.bankAccountNo.message}</p>
            )}
          </div>

          {/* Bank Name - Required */}
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name *
            </label>
            <input
              {...register("bankName")}
              type="text"
              id="bankName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bankName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter bank name"
            />
            {errors.bankName && (
              <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
            )}
          </div>

          {/* Address Line 1 - Optional */}
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input
              {...register("addressLine1")}
              type="text"
              id="addressLine1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address line 1"
            />
          </div>

          {/* Address Line 2 - Required */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2 *
            </label>
            <input
              {...register("addressLine2")}
              type="text"
              id="addressLine2"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.addressLine2 ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter address line 2"
            />
            {errors.addressLine2 && (
              <p className="mt-1 text-sm text-red-600">{errors.addressLine2.message}</p>
            )}
          </div>

          {/* City - Optional */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              {...register("city")}
              type="text"
              id="city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>

          {/* Country - Optional */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              {...register("country")}
              type="text"
              id="country"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country"
            />
          </div>

          {/* Zip Code - Optional */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <input
              {...register("zipCode")}
              type="text"
              id="zipCode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter zip code"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || isLoading ? "Creating..." : "Create Vendor"}
          </button>
        </div>
      </div>
    </form>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, type VendorFormData } from "@/types/vendor";

interface EditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: number | null;
  onVendorUpdated: () => void;
}

export default function EditVendorModal({ isOpen, onClose, vendorId, onVendorUpdated }: EditVendorModalProps) {
  const [vendor, setVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  // Load vendor details when modal opens
  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorDetails();
    }
  }, [isOpen, vendorId]);

  const fetchVendorDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setVendor(data.vendor);
        
        // Set form values
        setValue("vendorName", data.vendor.vendorName);
        setValue("bankAccountNo", data.vendor.bankAccountNo);
        setValue("bankName", data.vendor.bankName);
        setValue("addressLine1", data.vendor.addressLine1 || "");
        setValue("addressLine2", data.vendor.addressLine2);
        setValue("city", data.vendor.city || "");
        setValue("country", data.vendor.country || "");
        setValue("zipCode", data.vendor.zipCode || "");
      } else {
        alert('Error loading vendor details');
        onClose();
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
      alert('Error loading vendor details');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VendorFormData) => {
    if (!vendorId) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Vendor updated successfully!');
        onVendorUpdated();
        onClose();
        reset();
      } else {
        const errorData = await response.json();
        alert(`Error updating vendor: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert('Error updating vendor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setVendor(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Vendor</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading vendor details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Updating..." : "Update Vendor"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 
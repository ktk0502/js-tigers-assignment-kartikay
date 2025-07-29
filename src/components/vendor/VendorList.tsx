"use client";

import { Vendor } from "@/types/vendor";

interface VendorListProps {
  vendors: Vendor[];
}

export default function VendorList({ vendors }: VendorListProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No vendors created yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Vendors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vendor.vendorName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>{vendor.bankName}</div>
                    <div className="text-sm text-gray-500">
                      Acc: {vendor.bankAccountNo}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {vendor.addressLine1 && (
                      <div>{vendor.addressLine1}</div>
                    )}
                    <div>{vendor.addressLine2}</div>
                    {(vendor.city || vendor.country || vendor.zipCode) && (
                      <div className="text-sm text-gray-500">
                        {[vendor.city, vendor.country, vendor.zipCode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
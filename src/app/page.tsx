"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";
import VendorForm from "@/components/vendor/VendorForm";
import { VendorFormData, Vendor } from "@/types/vendor";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);

  // Fetch vendors when user is authenticated
  useEffect(() => {
    if (session?.user) {
      fetchVendors();
    }
  }, [session]);

  const fetchVendors = async () => {
    setIsLoadingVendors(true);
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleCreateVendor = async (vendorData: VendorFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(prev => [data.vendor, ...prev]);
      } else {
        const errorData = await response.json();
        alert(`Error creating vendor: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting vendor:", error);
      alert('Error creating vendor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendor Management System
            </h1>
            <p className="text-gray-600">
              Please sign in to manage your vendors
            </p>
          </div>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vendor Management System
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user?.name || session.user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/vendors')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Vendors
              </button>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Vendor Creation Form */}
          <section>
            <VendorForm onSubmit={handleCreateVendor} isLoading={isLoading} />
          </section>

        </div>
      </main>
    </div>
  );
}

import { getVendorInquiryById } from "@/lib/db";
import { VendorTrainingWorkspace } from "@/app/components/vendor-training-workspace";
import Link from "next/link";

type Props = {
  searchParams?: Promise<{ lead?: string }>;
};

export const dynamic = "force-dynamic";

export default async function VendorTrainingDashboardPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const leadId = sp.lead || "";
  const inquiry = leadId ? getVendorInquiryById(leadId) : null;

  if (!inquiry) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] py-16 px-4">
        <div className="max-w-xl mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Access pending</h1>
          <p className="text-gray-600 mb-4">
            This demo dashboard is available after a completed vendor registration.
          </p>
          <Link href="/vendors" className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">
            Return to Vendor Registration
          </Link>
        </div>
      </main>
    );
  }

  return <VendorTrainingWorkspace company={inquiry.company} leadId={leadId} />;
}

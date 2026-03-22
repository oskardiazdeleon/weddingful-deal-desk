import { getVendorInquiryById } from "@/lib/db";
import { VendorLiveCallStudio } from "@/app/components/vendor-live-call-studio";

type Props = {
  searchParams?: Promise<{ lead?: string; scenario?: string; company?: string }>;
};

export const dynamic = "force-dynamic";

export default async function VendorLiveDemoPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const leadId = sp.lead || "";
  const scenario = sp.scenario || "new-inquiry";

  const inquiry = leadId ? getVendorInquiryById(leadId) : null;
  const company = inquiry?.company || sp.company || "Wedding Program Demo";

  return <VendorLiveCallStudio company={company} leadId={leadId} scenario={scenario} />;
}

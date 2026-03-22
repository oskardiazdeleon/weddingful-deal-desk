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
  const buildVersion = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION || "local")
    .toString()
    .slice(0, 7);

  return (
    <VendorLiveCallStudio
      company={company}
      leadId={leadId}
      scenario={scenario}
      buildVersion={buildVersion}
    />
  );
}

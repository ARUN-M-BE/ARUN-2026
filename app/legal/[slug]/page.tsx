import { getLegalDocumentBySlug } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PortfolioNavbar } from "@/components/portfolio/navbar";
import { PortfolioFooter } from "@/components/portfolio/footer";
import { AlertTriangle, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getLegalDocumentBySlug(slug);

  if (!doc || doc.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#08090e] text-foreground flex flex-col justify-between">
      <PortfolioNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-32 pb-24 w-full space-y-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Return to Universe
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
            <span>VERSION {doc.version}</span>
            {doc.effectiveDate && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Effective: {new Date(doc.effectiveDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {doc.title}
          </h1>
        </div>

        {/* Review Required Disclaimer */}
        {doc.isReviewRequired && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3 leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold text-white">Statutory Review Draft Notice</p>
              <p className="mt-0.5 text-amber-200/80">
                This policy represents an editable template complying with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) and Information Technology Act, 2000. It requires legal review for specific enterprise deployments.
              </p>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap font-sans">
          {doc.content}
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}

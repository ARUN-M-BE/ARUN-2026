import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "draft" | "published" | "unpublished" | string }) {
  if (status === "published") {
    return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Published</Badge>;
  }
  if (status === "draft") {
    return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Draft</Badge>;
  }
  return <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 font-medium">Unpublished</Badge>;
}

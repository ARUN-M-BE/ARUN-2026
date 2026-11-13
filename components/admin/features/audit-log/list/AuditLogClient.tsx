"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/admin/empty-state";
import { History } from "lucide-react";
import type { AuditLogEntry } from "@/types";

export function AuditLogClient({ initialData }: { initialData: AuditLogEntry[] }) {
  return (
    <div>
      {initialData.length === 0 ? (
        <EmptyState
          title="No audit logs recorded yet"
          description="Administrative operations will be logged here automatically."
          icon={<History className="w-6 h-6" />}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Action</TableHead>
                <TableHead className="text-xs text-muted-foreground">Entity</TableHead>
                <TableHead className="text-xs text-muted-foreground">Entity ID</TableHead>
                <TableHead className="text-xs text-muted-foreground">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary/10 text-cyan-400 border border-primary/20">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-semibold text-white">
                    {log.entity}
                  </TableCell>
                  <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                    {log.entityId || "-"}
                  </TableCell>
                  <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

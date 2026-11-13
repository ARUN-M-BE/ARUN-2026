"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { updateMessageStatus, deleteMessage } from "@/lib/actions";
import { Mail, Trash2, Eye, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ContactMessage, MessageStatus } from "@/types";

export function MessagesClient({ initialData, totalPages: _totalPages }: { initialData: ContactMessage[]; totalPages: number }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialData);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (id: string, newStatus: ContactMessage["messageStatus"]) => {
    try {
      const res = await updateMessageStatus(id, newStatus);
      if (res.success) {
        toast.success(`Message marked as ${newStatus}`);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, messageStatus: newStatus } : m))
        );
        if (selectedMsg && selectedMsg.id === id) {
          setSelectedMsg((prev: any) => ({ ...prev, messageStatus: newStatus }));
        }
        router.refresh();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteMessage(deleteId);
      if (res.success) {
        toast.success("Message deleted");
        setMessages((prev) => prev.filter((m) => m.id !== deleteId));
        setDeleteId(null);
        if (selectedMsg?.id === deleteId) setSelectedMsg(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const openMessageModal = (msg: any) => {
    setSelectedMsg(msg);
    if (msg.messageStatus === "unread") {
      handleStatusChange(msg.id, "read");
    }
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <EmptyState
          title="No inquiries received"
          description="Inbound submissions from the 3D portfolio contact form will appear here."
          icon={<Mail className="w-6 h-6" />}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Sender & Subject</TableHead>
                <TableHead className="text-xs text-muted-foreground">Message Preview</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={`border-border hover:bg-white/5 transition-colors ${
                    msg.messageStatus === "unread" ? "bg-cyan-500/5 font-medium" : ""
                  }`}
                >
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                      {msg.name}
                      {msg.consentGiven && (
                        <span title="DPDP 2023 Consent Recorded">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">{msg.email}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-300 max-w-sm truncate">
                    {msg.subject ? <strong className="text-white">{msg.subject}: </strong> : null}
                    {msg.message}
                  </TableCell>
                  <TableCell className="py-3">
                    <Select
                      value={msg.messageStatus}
                      onValueChange={(val) => handleStatusChange(msg.id, val as MessageStatus)}
                    >
                      <SelectTrigger className="h-7 text-[11px] w-28 bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openMessageModal(msg)}
                        className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(msg.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Message View Dialog */}
      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{selectedMsg?.subject || "Portfolio Inbound Inquiry"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Received on {selectedMsg && new Date(selectedMsg.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedMsg && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="text-white font-medium">{selectedMsg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <a href={`mailto:${selectedMsg.email}`} className="text-cyan-400 hover:underline">
                    {selectedMsg.email}
                  </a>
                </div>
                {selectedMsg.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-white font-mono">{selectedMsg.phone}</span>
                  </div>
                )}
                {selectedMsg.company && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="text-white">{selectedMsg.company}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-border/40">
                  <span className="text-muted-foreground">DPDP Consent:</span>
                  <span className="text-emerald-400 font-mono">
                    {selectedMsg.consentGiven ? "Verified Explicit Consent" : "Not Recorded"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-zinc-300">Message Content:</span>
                <div className="p-4 rounded-lg bg-background/80 border border-border text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <a href={`mailto:${selectedMsg?.email}?subject=Re: ${encodeURIComponent(selectedMsg?.subject || "Portfolio Inquiry")}`}>
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
                Reply via Email Client
              </Button>
            </a>
            <Button variant="outline" size="sm" onClick={() => setSelectedMsg(null)} className="text-xs border-border">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Inquiry Record?"
      />
    </div>
  );
}

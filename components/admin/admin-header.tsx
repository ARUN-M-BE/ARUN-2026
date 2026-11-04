"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, LogOut, Shield, UserRound } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const initials = user.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/70 bg-background/85 px-3 backdrop-blur-xl sm:px-5 lg:px-7">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="h-8 gap-2 rounded-xl border-primary/20 bg-primary/5 px-3 font-mono text-[10px] tracking-wide text-primary"
        >
          <Shield className="size-3.5" />
          <span>ADMIN WORKSPACE</span>
        </Badge>
        <span className="hidden text-xs text-muted-foreground xl:inline">
          Manage your portfolio in one place
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-border/80 bg-card/70 px-3 text-xs"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5 text-primary" />
            <span className="hidden sm:inline">View portfolio</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 gap-2 rounded-xl px-2 text-left hover:bg-muted/70 sm:gap-3 sm:px-3"
              aria-label="Open account menu"
            >
              <Avatar className="size-8 ring-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-xs font-semibold text-primary">
                  {initials || <UserRound className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-36 truncate text-xs font-semibold text-foreground">
                  {user.name || "Administrator"}
                </span>
                <span className="block max-w-36 truncate text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="px-3 py-2.5">
              <span className="block truncate text-sm font-semibold text-foreground">
                {user.name || "Administrator"}
              </span>
              <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
              {user.role && (
                <Badge variant="primary" className="mt-2 h-5 rounded-full px-2 text-[10px]">
                  {user.role}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { void signOut({ callbackUrl: "/admin/login" }); }}>
              <LogOut className="size-4 text-destructive" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

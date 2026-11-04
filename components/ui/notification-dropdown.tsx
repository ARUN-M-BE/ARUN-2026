"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";


interface Notification {
  id: string | number;
  message: string;
  time: string;
  read?: boolean;
}

interface NotificationTranslations {
  notifications: string;
  noNotifications: string;
  viewAllNotifications: string;
}

interface NotificationDropdownProps {
  lang: string;
  mounted: boolean;
  count?: number;
  t: NotificationTranslations;
  notifications?: Notification[];
}

export default function NotificationDropdown({
  lang,
  mounted,
  count = 0,
  t,
  notifications = [],
}: NotificationDropdownProps) {
  return (
    <DropdownMenu dir={mounted && lang === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border hover:bg-muted/80 transition cursor-pointer"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />

          {count > 0 && (
            <span
              className={`absolute top-[13px] ${
                lang === "ar" ? "left-[13px]" : "right-[13px]"
              } h-2 w-2 rounded-full bg-red-500 ring-2 ring-background`}
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-[340px] p-0 overflow-hidden rounded-xl"
      >
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-sm text-foreground">
            {mounted ? t.notifications : "Notifications"}{" "}
            <span className="text-primary text-xs">({count})</span>
          </h3>
        </div>

        <div className="scroll-content max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="group flex items-start gap-3 rounded-none border-b p-4"
              >
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground leading-6 whitespace-normal">
                    {item.message}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>

                {!item.read && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {mounted ? t.noNotifications : "No notifications found"}
            </div>
          )}
        </div>

        <div className="border-t">
            <Link
              href="/notifications"
              className="flex w-full justify-center py-4 text-center text-primary font-medium text-sm transition"
            >
              {mounted
                ? t.viewAllNotifications
                : "View all Notifications"}
            </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
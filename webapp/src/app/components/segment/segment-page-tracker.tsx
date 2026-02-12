"use client";

import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    analytics?: {
      page: (name?: string, properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
    };
  }
}

export function SegmentPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (window.analytics) {
      const properties: Record<string, any> = {
        path: pathname,
        search: searchParams.toString(),
      };

      // Include user information if available
      if (status === "authenticated" && session?.user?.email) {
        properties.userId = session.user.email;
        properties.userName = session.user.name;
      }

      window.analytics.page(pathname, properties);
    }
  }, [pathname, searchParams, session, status]);

  return null;
}

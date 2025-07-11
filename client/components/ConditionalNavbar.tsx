"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on specific routes
  const hideNavbar =
    pathname.startsWith("/JoinWaitlist") || pathname.startsWith("/embed/");

  if (hideNavbar) {
    return null;
  }

  return <Navbar />;
}

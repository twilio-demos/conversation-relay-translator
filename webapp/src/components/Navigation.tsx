"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/", label: "Home" },
    { href: "/profiles", label: "Profiles" },
    { href: "/sessions", label: "Sessions" },
    {
      href: "https://github.com/twilio-demos/ConversationRelay-Translator/blob/main/README.md",
      label: "Guide",
      target: "_blank",
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            CR Translator
          </Link>

          <div className="flex items-center space-x-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  variant={isActive ? "underline" : "ghost"}
                  size="sm"
                  asChild>
                  <Link href={link.href} target={link.target}>
                    {link.label}
                  </Link>
                </Button>
              );
            })}

            {session ? (
              <div className="flex items-center space-x-3 ml-4">
                <span className="text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="destructive"
                  size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn("google")}
                size="sm"
                className="ml-4">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

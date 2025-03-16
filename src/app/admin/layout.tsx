"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Award, Briefcase, FileText, FolderKanban, Home, LogOut, Mail, Menu, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/admin/about", label: "About", icon: <FileText size={18} /> },
    { href: "/admin/skills", label: "Skills", icon: <Users size={18} /> },
    { href: "/admin/experience", label: "Experience", icon: <Briefcase size={18} /> },
    { href: "/admin/projects", label: "Projects", icon: <FolderKanban size={18} /> },
    { href: "/admin/certificates", label: "Certificates", icon: <Award size={18} /> },
    { href: "/admin/contact", label: "Contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full max-w-full">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="font-bold text-xl mb-6 mt-4">Admin Panel</div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/admin/dashboard" className="font-bold text-xl gradient-text">
              Admin Panel
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home size={14} /> View Site
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={() => {
                router.push("/api/auth/signout");
              }}
            >
              <LogOut size={14} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 md:px-6 w-full max-w-full">{children}</main>
    </div>
  );
} 
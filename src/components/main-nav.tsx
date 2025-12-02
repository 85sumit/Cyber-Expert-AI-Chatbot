"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCode, Newspaper, ScanLine } from "lucide-react";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/",
    label: "Vulnerability Scanner",
    icon: ScanLine,
  },
  {
    href: "/script-generator",
    label: "Script Generator",
    icon: FileCode,
  },
  {
    href: "/article-summarizer",
    label: "Article Summarizer",
    icon: Newspaper,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

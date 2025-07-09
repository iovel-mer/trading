"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, User, Home, Menu, Monitor } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUser } from "@/app/dashboard/context/user-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Finance",
    href: "/dashboard/finance",
    icon: DollarSign,
  },
  {
    name: "Trading",
    href: "/dashboard/trading",
    icon: TrendingUp,
  },
  {
    name: "My Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, openWebTrader } = useUser();
  const { toast } = useToast();

  const handleWebTraderClick = async () => {
    setIsOpen(false);
    try {
      await openWebTrader();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open Web Trader. Please try again.",
        variant: "destructive",
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center px-2 border-b mb-3">
        <Link
          href="/dashboard"
          className="flex h-[63px] items-center gap-2 font-semibold"
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <Image src="/Vector.png" alt="SalesVault" width={30} height={30} />
          </div>
          <span className="text-lg">SalesVault</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Web Trader Button */}
      <div className="px-2 py-2">
        <button
          onClick={handleWebTraderClick}
          className="flex items-center w-full rounded-md px-3 py-3 text-sm font-medium transition-colors bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
        >
          <Monitor className="mr-3 h-4 w-4 text-white" />
          Web Trader
        </button>
      </div>
      
      <Separator />
      <div className="p-2">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col", className)}>
        <div className="flex flex-col flex-grow bg-background border-r overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

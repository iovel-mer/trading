"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  User,
  Home,
  Menu,
  Monitor,
} from "lucide-react";
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
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: User,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isWebTraderLoading, setIsWebTraderLoading] = useState(false);
  const { user, openWebTrader } = useUser();
  const { toast } = useToast();

  const handleWebTraderClick = async () => {
    setIsOpen(false);
    setIsWebTraderLoading(true);
    try {
      await openWebTrader();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open Web Trader. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWebTraderLoading(false);
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

      <div className="flex items-center   !w-full">
        <div className="px-2 py-2 w-full">
          <button
            onClick={handleWebTraderClick}
            disabled={isWebTraderLoading}
            className="relative flex items-center cursor-pointer w-full rounded-lg px-4 py-3 text-sm font-medium transition-all duration-400 ease-out
                     bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800
                     hover:from-slate-700 hover:via-slate-600 hover:to-slate-700
                     text-slate-100 shadow-lg hover:shadow-xl hover:shadow-blue-500/10
                     transform hover:scale-[1.02]
                     disabled:from-slate-800 disabled:to-slate-900 disabled:cursor-not-allowed
                     disabled:hover:scale-100 disabled:shadow-lg
                     border border-slate-600/50 hover:border-blue-400/30
                     overflow-hidden group"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-500/10 to-blue-600/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            {/* Subtle animated shine */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
            ></div>

            {/* Content */}
            <div className="relative z-10 flex items-center w-full">
              {isWebTraderLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400/30 border-t-blue-400 mr-3" />
                  <span className="tracking-wide text-slate-200">
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    >
                      O
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "100ms" }}
                    >
                      p
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "200ms" }}
                    >
                      e
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    >
                      n
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "400ms" }}
                    >
                      i
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "500ms" }}
                    >
                      n
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "600ms" }}
                    >
                      g
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "700ms" }}
                    >
                      .
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "800ms" }}
                    >
                      .
                    </span>
                    <span
                      className="inline-block animate-pulse"
                      style={{ animationDelay: "900ms" }}
                    >
                      .
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <Monitor
                    className="mr-3 h-4 w-4 text-slate-300 transition-all duration-300 
                                   group-hover:text-blue-400 group-hover:scale-110"
                  />
                  <span className="tracking-wide transition-all duration-300 group-hover:tracking-wider text-slate-100">
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-blue-300"
                      style={{ transitionDelay: "0ms" }}
                    >
                      W
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-slate-200"
                      style={{ transitionDelay: "50ms" }}
                    >
                      e
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-blue-300"
                      style={{ transitionDelay: "100ms" }}
                    >
                      b
                    </span>
                    <span
                      className="inline-block mx-1 transition-all duration-200"
                      style={{ transitionDelay: "150ms" }}
                    >
                      {" "}
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-blue-300"
                      style={{ transitionDelay: "200ms" }}
                    >
                      T
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-slate-200"
                      style={{ transitionDelay: "250ms" }}
                    >
                      r
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-blue-300"
                      style={{ transitionDelay: "300ms" }}
                    >
                      a
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-slate-200"
                      style={{ transitionDelay: "350ms" }}
                    >
                      d
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-blue-300"
                      style={{ transitionDelay: "400ms" }}
                    >
                      e
                    </span>
                    <span
                      className="inline-block transition-all duration-200 group-hover:text-slate-200"
                      style={{ transitionDelay: "450ms" }}
                    >
                      r
                    </span>
                  </span>
                </>
              )}
            </div>

            {/* Professional accent line */}
            <div
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 
                          group-hover:w-full transition-all duration-500 ease-out"
            ></div>

            {/* Subtle corner indicators */}
            <div
              className="absolute top-2 right-2 w-1 h-1 bg-blue-400/50 rounded-full 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </button>
        </div>
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

import Link from "next/link";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary font-semibold", className)}>
      <Landmark className="h-6 w-6" />
      <span className="text-lg font-headline">LoanPilot AI</span>
    </Link>
  );
}

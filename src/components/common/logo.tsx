import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary font-semibold", className)}>
      <Image 
        src="https://i.postimg.cc/jjf05QN2/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png" 
        alt="Loanify Logo" 
        width={400} 
        height={400} 
        className="h-100 w-100 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold">Loanify</span>
        <span className="text-xs text-muted-foreground">Simplify Loan Approvals with Intelligence</span>
      </div>
    </Link>
  );
}

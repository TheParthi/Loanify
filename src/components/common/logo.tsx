import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary font-semibold", className)}>
      <Image 
        src="/logo.png" 
        alt="Loanify Logo" 
        width={40} 
        height={40} 
        className="h-10 w-10 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold">Loanify</span>
        <span className="text-xs text-muted-foreground">Simplify Loan Approvals with Intelligence</span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 text-primary font-semibold", className)}>
      <Image 
        src="https://i.postimg.cc/MGyDGd6p/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png" 
        alt="Loanify Logo" 
        width={48} 
        height={48} 
        className="h-12 w-12 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-xl font-bold">Loanify NBFC</span>
        <span className="text-xs text-muted-foreground">RBI Licensed • NBFC-ND-SI • Est. 2020</span>
      </div>
    </Link>
  );
}

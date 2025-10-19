'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  Circle,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { applicants } from '@/lib/data';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';

export function SidebarNav() {
  const pathname = usePathname();
  const recentApplicants = applicants.slice(0, 5);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Logo className="text-sidebar-foreground" />
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/admin'}
              tooltip="Admin Dashboard"
            >
              <Link href="/dashboard/admin">
                <LayoutDashboard />
                <span>Admin Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/staff'}
              tooltip="Staff Dashboard"
            >
              <Link href="/dashboard/staff">
                <Users />
                <span>Staff Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup className='p-0 mt-4'>
            <Collapsible defaultOpen>
                <SidebarGroupContent>
                    <CollapsibleTrigger className="w-full">
                        <SidebarGroupLabel className='w-full'>
                            <div className='flex items-center justify-between w-full'>
                                <span>Recent Applicants</span>
                                <ChevronDown className='h-4 w-4 transition-transform [&[data-state=open]]:rotate-180'/>
                            </div>
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                </SidebarGroupContent>
                <CollapsibleContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                        <SidebarMenuSub>
                            {recentApplicants.map((applicant) => (
                            <SidebarMenuSubItem key={applicant.id}>
                                <SidebarMenuSubButton
                                asChild
                                size="sm"
                                isActive={pathname === `/dashboard/applicants/${applicant.id}`}
                                >
                                <Link href={`/dashboard/applicants/${applicant.id}`}>
                                    <Circle className="!size-2" />
                                    <span>{applicant.name}</span>
                                </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

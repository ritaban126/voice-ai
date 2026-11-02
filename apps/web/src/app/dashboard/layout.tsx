'use client';

import { RoleProvider } from '@/hooks/use-role';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleProvider>{children}</RoleProvider>;
}
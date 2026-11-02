// 'use client';

// import * as React from 'react';
// import { usePathname } from 'next/navigation';
// import type { Role, Language } from '@/types';

// interface RoleContextValue {
//   role: Role;
//   setRole: (r: Role) => void;
//   voiceReplies: boolean;
//   setVoiceReplies: (v: boolean) => void;
//   language: Language;
//   setLanguage: (l: Language) => void;
// }

// const RoleContext = React.createContext<RoleContextValue | null>(null);

// function roleFromPath(pathname: string | null): Role {
//   if (pathname?.includes('/dashboard/worker')) return 'worker';
//   if (pathname?.includes('/dashboard/employer')) return 'employer';
//   return 'employer';
// }

// export function RoleProvider({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const [role, setRole] = React.useState<Role>('employer');
//   const [voiceReplies, setVoiceReplies] = React.useState(true);
//   const [language, setLanguage] = React.useState<Language>('en');

//   // Keep role in sync with the URL so direct navigation to
//   // /dashboard/worker or /dashboard/employer shows the right nav.
//   React.useEffect(() => {
//     const pathRole = roleFromPath(pathname);
//     setRole(pathRole);
//   }, [pathname]);

//   return (
//     <RoleContext.Provider
//       value={{ role, setRole, voiceReplies, setVoiceReplies, language, setLanguage }}
//     >
//       {children}
//     </RoleContext.Provider>
//   );
// }

// export function useRole() {
//   const ctx = React.useContext(RoleContext);
//   if (!ctx) throw new Error('useRole must be used within RoleProvider');
//   return ctx;
// }





'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import type { Role, Language } from '@/types';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  voiceReplies: boolean;
  setVoiceReplies: (v: boolean) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const RoleContext = React.createContext<RoleContextValue | null>(null);

function roleFromPath(pathname: string | null): Role {
  if (pathname?.includes('/dashboard/worker')) return 'worker';
  if (pathname?.includes('/dashboard/employer')) return 'employer';
  return 'employer';
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [manualRole, setManualRole] = React.useState<Role | null>(null);
  const [voiceReplies, setVoiceReplies] = React.useState(true);
  const [language, setLanguage] = React.useState<Language>('en');

  const pathRole = roleFromPath(pathname);
  const role = pathRole;

  const setRole = (newRole: Role) => {
    setManualRole(newRole);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        voiceReplies,
        setVoiceReplies,
        language,
        setLanguage,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = React.useContext(RoleContext);

  if (!ctx) {
    throw new Error('useRole must be used within RoleProvider');
  }

  return ctx;
}

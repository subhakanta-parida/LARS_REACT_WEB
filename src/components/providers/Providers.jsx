'use client';

import { MuxProvider } from '@manulife/mux';

import { LoginProvider } from 'src/state/login/LoginContext';

export default function Providers({ children }) {
  return (
    <MuxProvider>
      <LoginProvider>{children}</LoginProvider>
    </MuxProvider>
  );
}
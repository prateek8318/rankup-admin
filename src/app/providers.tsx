/**
 * All global providers (Auth, Theme, Redux, etc.)
 */
import React from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/features/auth";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  );
};

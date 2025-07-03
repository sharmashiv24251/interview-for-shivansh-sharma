"use client";
import React, { ReactNode, FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: ReactNode;
}

// Use FC type for functional component
const Providers: FC<ProvidersProps> = ({ children }) => {
  // Create the QueryClient once
  const queryClient = React.useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;

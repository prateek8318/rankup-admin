import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";

const App: React.FC = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;

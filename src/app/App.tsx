import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/AppRoutes";
import { Providers } from "@/app/providers";
import "@/styles/index.css";

const App: React.FC = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;

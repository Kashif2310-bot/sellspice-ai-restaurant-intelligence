import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => (
  <div className="min-h-screen flex bg-background grid-bg">
    <Sidebar />
    <main className="flex-1 min-w-0">
      <Outlet />
    </main>
  </div>
);

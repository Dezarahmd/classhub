
import { useRef } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const mainRef = useRef(null);

  function handleSkipNavigation(event) {
    event.preventDefault();
    mainRef.current?.focus();
  }

  return (
    <div className="h-screen overflow-hidden bg-background md:flex">
      <a
        href="#main-content"
        onClick={handleSkipNavigation}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-on-primary focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        Lewati ke konten utama
      </a>

      <Sidebar />

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8"
      >
        <Outlet />
      </main>
    </div>
  );
}

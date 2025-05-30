import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SidebarInset, SidebarProvider } from "./sidebar";
import { QuickCreateModal } from "../modals";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const handleQuickCreateClick = () => {
    setIsQuickCreateOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" onQuickCreateClick={handleQuickCreateClick} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col h-full w-full">
              {children}

              <Footer />
            </div>
          </div>
        </div>
      </SidebarInset>

      <ToastContainer />

      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </SidebarProvider>
  );
}

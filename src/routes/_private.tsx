import { AppMobileSidebar } from "@/components/app-mobile-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
    const { session, isLoading } = context.auth;

    if (context.auth == null || isLoading) {
      return;
    }

    if (!session) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: PrivateLayout,
});

function PrivateLayout() {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}

      <main className={`w-full p-4 ${isMobile ? "mb-16" : ""}`}>
        {!isMobile && <SidebarTrigger />}
        <Outlet />
      </main>
      {isMobile && <AppMobileSidebar />}
    </SidebarProvider>
  );
}

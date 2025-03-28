import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UpdaterService from "@/lib/updaterService";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.session) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    } else
      throw redirect({
        to: "/dashboard",
        search: {
          redirect: location.href,
        },
      });
  },
  component: Index,
});

function Index() {
  const { loading, updateStatus, checkForUpdate, downloadAndInstall } =
    UpdaterService({ autoCheck: false });

  const handleCheckUpdate = async () => {
    console.log("hello");
    await checkForUpdate();
    console.log(updateStatus, loading);
    if (updateStatus.version && !updateStatus.status) {
      toast.info(`New update available: v${updateStatus.version}`, {
        description: updateStatus.releaseNotes,
        action: {
          label: "Update Now",
          onClick: downloadAndInstall,
        },
      });
    } else if (updateStatus.status === "Up-to-date") {
      toast.success("App is up to date");
    }
  };
  return (
    <main className="container">
      <h1>Welcome to Tauri + Reacts THis is a public page</h1>
      <Button
        onClick={handleCheckUpdate}
        disabled={loading}
        variant={"outline"}
        size={"sm"}
      >
        Check for updates
      </Button>
    </main>
  );
}

export default Index;

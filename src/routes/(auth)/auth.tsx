import { createFileRoute, redirect } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SigninForm } from "@/routes/-components/forms/signinForm";
import { SignupForm } from "@/routes/-components/forms/signupForm";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/authProvider";

export const Route = createFileRoute("/(auth)/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // If we get here, loading is complete and there's no session
  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="sign-in" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">sign-in</TabsTrigger>
          <TabsTrigger value="sign-up">sign-up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <SigninForm />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignupForm />
        </TabsContent>
        <TabsContent value="test-up"></TabsContent>
      </Tabs>
    </div>
  );
}

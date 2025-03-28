import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { signinSchema, signupSchema } from "@/types/authSchema";

export function useAuthentication() {
  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const parsedData = signupSchema.parse({ email, password });
      const { data, error } = await supabase.auth.signUp(parsedData);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const signIn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const parsedData = signinSchema.parse({ email, password });
      const { data, error } = await supabase.auth.signInWithPassword(
        parsedData
      );
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      console.log("inside signout");
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw new Error(error.message);
      return { success: true };
    },
  });

  return { signUp, signIn, signOut };
}

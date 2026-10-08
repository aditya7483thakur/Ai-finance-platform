import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/custom/AuthLayout";
import PasswordInput from "@/components/custom/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserContext } from "@/contexts/userContext";
import { useSignIn } from "@/services/auth/mutation";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const inputClass = "h-10 bg-white/[0.03]";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const signInMutation = useSignIn();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    signInMutation.mutate(values, {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(err.response?.data?.error || "Invalid email or password");
      },
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your accounts and budgets."
      footer={
        <>
          New to Budgetly?{" "}
          <Link to="/sign-up" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Your password"
                    className={inputClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-2 h-10 w-full"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {signInMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignInPage;

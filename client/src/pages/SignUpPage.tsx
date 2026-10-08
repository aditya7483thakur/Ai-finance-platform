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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserContext } from "@/contexts/userContext";
import { useSignUp } from "@/services/auth/mutation";

const schema = z
  .object({
    name: z.string().trim().min(1, "Enter your name"),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email")
      .email("Enter a valid email address"),
    password: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const inputClass = "h-10 bg-white/[0.03]";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const signUpMutation = useSignUp();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = ({ name, email, password }: z.infer<typeof schema>) => {
    signUpMutation.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast.success("Account created successfully!");
          navigate("/dashboard");
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(err.response?.data?.error || "Failed to create account");
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free to use. Set up your first budget in a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="Jane Doe"
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className={inputClass}
                    {...field}
                  />
                </FormControl>
                {!fieldState.error && (
                  <FormDescription className="text-xs">
                    At least 6 characters.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Repeat your password"
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
            disabled={signUpMutation.isPending}
          >
            {signUpMutation.isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {signUpMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignUpPage;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  UserLoginInputs,
  user_login_schema,
} from "@/validation/auth.validation";
import { login_user } from "@/actions/user.action";

export function SignInForm() {
  const form = useForm<UserLoginInputs>({
    resolver: zodResolver(user_login_schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const pathName = usePathname();
  const { isLoading, isSubmitting } = form.formState;

  async function onSubmit(data: UserLoginInputs) {
    toast.promise(
      // Promise function
      async () => {
        const result = await login_user(data);
        if (result?.error) {
          throw new Error(result.error);
        }
        if (result?.success) {
          if (pathName.startsWith("/pricing-plan")) {
            window.location.href = pathName;
          } else {
            window.location.href = "/";
          }

          return result;
        }
      },
      {
        loading: "Checking credentials...",
        success: () => "User logged in successfully!",
        error: (err) => err.message || "An error occurred",
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">if you don't have an account, please register.</p>
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}

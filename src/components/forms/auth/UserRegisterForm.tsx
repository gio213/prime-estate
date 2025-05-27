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
import { Loader2 } from "lucide-react";

import Link from "next/link";
import {
  user_register_schema,
  UserRegisterInputs,
} from "@/validation/auth.validation";
import { register_user } from "@/actions/user.action";

export function SignUpForm() {
  const form = useForm<UserRegisterInputs>({
    resolver: zodResolver(user_register_schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      lastName: "",
      phone: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: UserRegisterInputs) {
    const promise = async () => {
      const result = await register_user(data);
      if (result?.error) {
        throw new Error(result.error);
      }
      if (result?.success) {
        return result;
      }
      throw new Error("Unknown error occurred");
    };

    toast.promise(promise(), {
      loading: "დაელოდეთ...",
      success: () => {
        form.reset();
        return "User registered successfully!";
      },
      error: (err) => err.message || "An error occurred",
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              პირადი ინფორმაცია
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+995 555 55 55 55" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button and Login Link */}
          <div className="space-y-6 pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  wait...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <div className="text-center space-y-2 pt-4 border-t">
              <p className="text-sm">
                if you already have an account, you can log in here:
              </p>
              <Link
                href="/auth/login"
                className="inline-block font-medium hover:underline transition-all duration-200 text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

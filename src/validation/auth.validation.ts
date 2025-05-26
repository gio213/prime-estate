import { z } from "zod";

export const user_register_schema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 digits long"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const user_login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type UserRegisterInputs = z.infer<typeof user_register_schema>;
export type UserLoginInputs = z.infer<typeof user_login_schema>;

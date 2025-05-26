"use server";

import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import {
  user_register_schema,
  UserRegisterInputs,
  UserLoginInputs,
  user_login_schema,
} from "@/validation/auth.validation";
import { signToken, verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { Asap, Whisper } from "next/font/google";

export const register_user = async (formData: UserRegisterInputs) => {
  try {
    const parsedData = user_register_schema.safeParse(formData);
    if (!parsedData.success) {
      return {
        error: parsedData.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { email, lastName, name, password, phone } = parsedData.data;

    if (!email || !password || !name || !lastName || !phone) {
      return { error: "All fields are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        lastName,
        phone,
        password: hashedPassword,
      },
    });
    return {
      success: true,
      user: newUser,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while registering the user" };
  }
};

export const login_user = async (formData: UserLoginInputs) => {
  try {
    const parsedData = user_login_schema.safeParse(formData);
    if (!parsedData.success) {
      return {
        error: parsedData.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { email, password } = parsedData.data;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("User found:", user);

    if (!user) {
      return { error: "User not found" };
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid password" };
    }

    // create token
    const token = await signToken({
      email: user.email,
      id: user.id,
      fullName: `${user.name} ${user.lastName}`,
      role: user.role,
    });
    // set token in cookies

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 დღე (to match JWT expiry)
    });

    return {
      success: true,
      user: user,
      message: "User logged in successfully",
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while logging in the user" };
  }
};

export const get_current_user = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return null; // No token found
    }
    // Verify and decode the token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return null; // Invalid token
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        properties: true,
        id: true,
        email: true,
        CreditTransaction: true,
        credit: true,
        lastName: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...currentUser,
    };
  } catch (error) {
    console.error(error);
    return null; // Error occurred while fetching user
  }
};

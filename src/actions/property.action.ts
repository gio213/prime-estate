"use server";

import { PropertyFormValues } from "@/validation/property.validation";
import { dbUser } from "./user.action";
import { prisma } from "@/lib/prisma";

export type PropertyWithStringImages = Omit<PropertyFormValues, "images"> & {
  images: string[];
};

export const addProperty = async (property: PropertyWithStringImages) => {
  try {
    const user = await dbUser();
    if (!user) {
      return { message: "Unauthenticated user", success: false };
    }
    const newProperty = await prisma.property.create({
      data: {
        ...property,
        userId: user.id,
        images: property.images, // Now these are URLs instead of Files
      },
    });
    return {
      message: "Property added successfully",
      success: true,
      property: newProperty,
    };
  } catch (error) {
    console.error(error);
    return { message: "Error adding property", success: false };
  }
};

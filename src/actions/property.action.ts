"use server";

import {
  PropertyFormValues,
  propertyValidation,
} from "@/validation/property.validation";
import { dbUser } from "./user.action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type PropertyWithStringImages = Omit<PropertyFormValues, "images"> & {
  images: string[];
};

export const addProperty = async (property: PropertyWithStringImages) => {
  try {
    const user = await dbUser();
    if (!user) {
      return { message: "Unauthenticated user", success: false };
    }

    // const parsedData = propertyValidation.safeParse(property);
    // console.log("Parsed Data:", parsedData.data);
    // if (!parsedData.success) {
    //   return {
    //     message: "Invalid data",
    //     success: false,
    //     errors: parsedData.error.flatten().fieldErrors,
    //   };
    // }

    const newProperty = await prisma.property.create({
      data: {
        ...property,
        userId: user.id,
        sellerName: user.name!,
        images: property.images,
      },
    });
    revalidatePath("/my-profile/my-listings");

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

export const getUserProperties = async (id?: string) => {
  try {
    const user = await dbUser();
    if (!user) {
      return { message: "Unauthenticated user", success: false };
    }
    const properties = await prisma.property.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!properties) {
      return { message: "No properties found", success: false };
    }

    return {
      message: "Properties fetched successfully",
      success: true,
      properties,
    };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching properties", success: false };
  }
};

export const getPropertyById = async (id: string) => {
  try {
    if (!id) {
      return { message: "Property ID is required", success: false };
    }
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!property) {
      return { message: "Property not found", success: false };
    }
    // Check if the property is available

    return {
      message: "Property fetched successfully",
      success: true,
      property,
    };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching property", success: false };
  }
};

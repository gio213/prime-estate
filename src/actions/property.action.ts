"use server";

import {
  serverPropertyValidation,
  propertyValidation,
  PropertyFormAction,
} from "@/validation/property.validation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { get_current_user } from "./user.action";

export const addProperty = async (property: PropertyFormAction) => {
  try {
    const parsedData = serverPropertyValidation.safeParse(property);
    if (!parsedData.success) {
      return {
        message: "Validation failed",
        success: false,
        errors: parsedData.error.errors,
      };
    }
    const user = await get_current_user();
    if (!user) {
      return { message: "Unauthenticated user", success: false };
    }
    if (user?.credit! < 1) {
      return { message: "Insufficient credits", success: false };
    }

    const newProperty = await prisma.property.create({
      data: {
        ...parsedData.data,
        userId: user.id as string,
        sellerName: user.name!,
      },
    });

    // Deduct 1 credit from the user
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        credit: user.credit! - 1,
      },
    });
    // Revalidate the path to update the cache
    revalidatePath("/");
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

export const getUserProperties = async () => {
  try {
    const user = await get_current_user();
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

export const getUserPropertiesPaginated = async ({
  page = 1,
  limit = 10,
}: {
  id?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const user = await get_current_user();
    if (!user) {
      return { message: "Unauthenticated user", success: false };
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Get total count first (for calculating total pages)
    const totalCount = await prisma.property.count({
      where: {
        userId: user.id,
      },
    });

    // Get paginated properties
    const properties = await prisma.property.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Most recent first, modify as needed
      },
    });

    if (!properties || properties.length === 0) {
      return {
        message: "No properties found",
        success: false,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        },
      };
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      message: "Properties fetched successfully",
      success: true,
      properties,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching properties", success: false };
  }
};

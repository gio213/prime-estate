import { z } from "zod";

const FOR = ["RENT", "SALE"] as const;
const TYPE = [
  "APARTMENT",
  "HOUSE",
  "LAND",
  "OFFICE",
  "COMMERCIAL",
  "GARAGE",
  "PARKING",
  "STORAGE",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const propertyValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }), // Remove nullable
  price: z.number().min(1, { message: "Price is required" }),
  sellerPhone: z.string().min(1, { message: "Phone number is required" }),

  for: z.enum(FOR, {
    required_error: "Property status (For Rent/Sale) is required",
  }),
  type: z.enum(TYPE, {
    required_error: "Property type is required",
  }),

  area: z.number().min(1, { message: "Area is required" }),
  rooms: z.number().int().min(1, { message: "Rooms must be 1 or higher" }),
  bathrooms: z.number().int().min(0, { message: "Bathrooms are required" }),
  garage: z.number().int().min(0).optional(), // Garage is optional and can be null

  // Boolean fields matching Prisma schema
  garden: z.boolean().optional(),
  balcony: z.boolean().optional(),
  terrace: z.boolean().optional(),
  pool: z.boolean().optional(),
  airConditioning: z.boolean().optional(),
  heating: z.boolean().optional(),
  furnished: z.boolean().optional(),
  elevator: z.boolean().optional(),
  parking: z.boolean().optional(),

  location: z.string().min(1, { message: "Location is required" }), // Remove nullable

  images: z
    .array(
      z
        .custom<File>()
        .refine((file) => file instanceof File, "Must be a File")
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          "File size must be less than 5MB"
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported"
        )
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images are allowed"),
});

export type PropertyFormValues = z.infer<typeof propertyValidation>;

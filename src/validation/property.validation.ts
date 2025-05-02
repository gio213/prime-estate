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
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .nullable()
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .nullable()
    .optional(),
  price: z
    .number()
    .min(0, { message: "Price must be 0 or higher" })
    .nullable()
    .optional(),
  for: z.enum(FOR).optional().nullable(),
  type: z.enum(TYPE).optional().nullable(),

  area: z
    .number()
    .min(0, { message: "Area must be 0 or higher" })
    .nullable()
    .optional(),
  rooms: z
    .number()
    .int()
    .min(0, { message: "Rooms must be 0 or higher" })
    .nullable()
    .optional(),
  bathrooms: z
    .number()
    .int()
    .min(0, { message: "Bathrooms must be 0 or higher" })
    .nullable()
    .optional(),
  garage: z
    .number()
    .int()
    .min(0, { message: "Garage must be 0 or higher" })
    .nullable()
    .optional(),
  garden: z.boolean().nullable().optional(),
  balcony: z.boolean().nullable().optional(),
  terrace: z.boolean().nullable().optional(),
  pool: z.boolean().nullable().optional(),
  airConditioning: z.boolean().nullable().optional(),
  heating: z.boolean().nullable().optional(),
  furnished: z.boolean().nullable().optional(),
  elevator: z.boolean().nullable().optional(),
  parking: z.boolean().nullable().optional(),
  location: z.string().nullable().optional(),
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

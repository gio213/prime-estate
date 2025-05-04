"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Progress } from "@/components/ui/progress";

import {
  propertyValidation,
  type PropertyFormValues,
} from "@/validation/property.validation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";
import {
  addProperty,
  PropertyWithStringImages,
} from "@/actions/property.action";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { set } from "zod";

const FOR_OPTIONS = [
  { value: "RENT", label: "For Rent" },
  { value: "SALE", label: "For Sale" },
];

const TYPE_OPTIONS = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "LAND", label: "Land" },
  { value: "OFFICE", label: "Office" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "GARAGE", label: "Garage" },
  { value: "PARKING", label: "Parking" },
  { value: "STORAGE", label: "Storage" },
];

interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
}

export function PropertyForm({ initialValues }: PropertyFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyValidation),
    defaultValues: {
      name: initialValues?.name,
      sellerPhone: initialValues?.sellerPhone,
      description: initialValues?.description,
      price: initialValues?.price || 0,
      for: initialValues?.for,
      type: initialValues?.type,
      area: initialValues?.area || 0,
      rooms: initialValues?.rooms || 0,
      bathrooms: initialValues?.bathrooms || 0,
      garage: initialValues?.garage || 0,
      garden: initialValues?.garden || false,
      balcony: initialValues?.balcony || false,
      terrace: initialValues?.terrace || false,
      pool: initialValues?.pool || false,
      airConditioning: initialValues?.airConditioning || false,
      heating: initialValues?.heating || false,
      furnished: initialValues?.furnished || false,
      elevator: initialValues?.elevator || false,
      parking: initialValues?.parking || false,
      location: initialValues?.location || "",
      images: initialValues?.images,
    },
  });

  // Setup image previews if initial values contain images
  useEffect(() => {
    if (initialValues?.images && initialValues.images.length > 0) {
      const previews = initialValues.images.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(previews);
    }
  }, [initialValues?.images]);

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Get current images from form
    const currentImages = form.getValues("images") || [];

    // Check if adding new files would exceed the limit
    if (currentImages.length + files.length > 5) {
      toast.error("You can only upload a maximum of 5 images");
      return;
    }

    // Convert FileList to array of Files
    const newFiles = Array.from(files);

    // Create URLs for preview
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    // Update form values and previews
    const updatedImages = [...currentImages, ...newFiles];
    form.setValue("images", updatedImages);
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    // Get current images and previews
    const currentImages = form.getValues("images") || [];
    const currentPreviews = [...imagePreviews];

    // Remove the image at the specified index
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);

    // Remove the preview at the specified index
    currentPreviews.splice(index, 1);

    // Update form values and previews
    form.setValue("images", updatedImages);
    setImagePreviews(currentPreviews);

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = async (data: PropertyFormValues) => {
    setIsUploading(true);

    // Create a promise for the entire upload and submission process
    const uploadAndSubmitPromise = (async () => {
      // Upload images first
      const imageUrls = await handlePhotoUpload(data.images);

      // Prepare data for submission
      const propertyData: PropertyWithStringImages = {
        ...data,
        images: imageUrls,
      };

      const result = await addProperty(propertyData);
      if (!result.success) {
        throw new Error(result.message);
      }
    })();

    // Show toast with progress based on the promise
    toast.promise(uploadAndSubmitPromise, {
      loading: (
        <div className="flex flex-col gap-2">
          <p>Uploading property images...</p>
          <Progress value={uploadProgress} className="h-2 w-full" />
          <p>{uploadProgress}%</p>
        </div>
      ),
      success: "Property created successfully!",
      error: (error) =>
        `Error: ${error?.message || "Failed to create property"}`,
    });

    try {
      await uploadAndSubmitPromise;
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const blob = await upload(
          `prime-estate/${user?.id}/${file.name}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/property-photo-upload",
            onUploadProgress: (progress) => {
              setUploadProgress(progress.percentage);
              console.log("Upload progress:", progress.percentage);
            },
          }
        );
        return blob.url;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Error uploading photos:", error);
      throw error;
    } finally {
      setUploadProgress(0); // Reset progress after upload
      setIsUploading(false); // Reset uploading state
      form.resetField("images", {
        defaultValue: [],
        keepDirty: false,
        keepTouched: false,
        keepError: false,
      }); // Reset the images field in the form
      form.reset();
      setImagePreviews([]); // Clear image previews
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialValues ? "Edit Property" : "Add New Property"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Property name"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number
                      <span className="text-xs text-muted-foreground">
                        (e.g., +1234567890)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact number"
                        type="tel"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the property"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-center gap-4">
              <FormField
                control={form.control}
                name="for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rest of the form fields remain unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Spaces</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address or location"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images (Max 5)</FormLabel>
                    <FormDescription>
                      Select up to 5 images for your property listing.
                    </FormDescription>
                    <FormControl>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        multiple
                      />
                    </FormControl>
                    <FormMessage />
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="garden"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Garden</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Balcony</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terrace"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Terrace</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pool"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Pool</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airConditioning"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Air Conditioning
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heating"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Heating</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Furnished</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="elevator"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Elevator</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Parking</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? (
                  <Loader2Icon size={20} className="animate-spin" />
                ) : initialValues ? (
                  "Update Property"
                ) : (
                  "Create Property"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

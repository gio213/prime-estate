import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Use path.resolve to ensure correct file path
  const filePath = path.resolve(__dirname, "generated_60_properties.json");
  const data = await fs.readFile(filePath, "utf-8");
  const propertiesRaw = JSON.parse(data);

  // Clean the properties by removing timestamp fields
  const properties = propertiesRaw.map((property: any) => {
    // Destructure to remove the timestamp fields
    const { createdAt, updatedAt, expiresAt, ...cleanedProperty } = property;
    return cleanedProperty;
  });

  console.log(`Found ${properties.length} properties to seed`);

  for (const property of properties) {
    // Add ID check to handle properties that might not have an ID
    if (!property.id) {
      console.warn("Property missing ID, skipping:", property.name);
      continue;
    }

    await prisma.property.upsert({
      where: { id: property.id },
      update: property,
      create: property,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

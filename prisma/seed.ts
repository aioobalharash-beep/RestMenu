import { PrismaClient } from "@prisma/client";
import { sampleMenu } from "../src/lib/store/sample-menu";

const prisma = new PrismaClient();

async function main() {
  // IMPORT_MENU=1 (or --force) wipes the existing menu and reloads from code.
  const force =
    process.env.IMPORT_MENU === "1" || process.argv.includes("--force");

  if (force) {
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();
    console.log("IMPORT_MENU set — cleared existing menu.");
  }

  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log(`Menu already has ${existing} categories — skipping seed.`);
    return;
  }

  for (const category of sampleMenu) {
    await prisma.category.create({
      data: {
        name: category.name,
        nameAr: category.nameAr,
        kicker: category.kicker,
        position: category.position,
        items: {
          create: category.items.map((item) => ({
            name: item.name,
            nameAr: item.nameAr,
            description: item.description,
            descriptionAr: item.descriptionAr,
            priceBaisa: item.priceBaisa,
            imageUrl: item.imageUrl,
            position: item.position,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${sampleMenu.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

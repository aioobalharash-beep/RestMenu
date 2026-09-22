import { PrismaClient } from "@prisma/client";
import { sampleMenu } from "../src/lib/store/sample-menu";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log(`Menu already has ${existing} categories — skipping seed.`);
    return;
  }

  for (const category of sampleMenu) {
    await prisma.category.create({
      data: {
        name: category.name,
        kicker: category.kicker,
        position: category.position,
        items: {
          create: category.items.map((item) => ({
            name: item.name,
            description: item.description,
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

import { PrismaClient, Role } from "@prisma/client"; // Import Role nếu bạn muốn dùng nó rõ ràng
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toPascalCase(fileName: string): string {
  const nameWithoutExtension = fileName.replace(".json", "");
  return nameWithoutExtension
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function toCamelCase(fileName: string): string {
  const nameWithoutExtension = fileName.replace(".json", "");
  const pascal = nameWithoutExtension
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

async function deleteAllData(modelFileNames: string[]) {
  console.log("Starting to delete all data...");
  for (const modelFile of [...modelFileNames].reverse()) {
    const modelNameCamel = toCamelCase(modelFile);
    const model = (prisma as any)[modelNameCamel];

    if (!model || typeof model.deleteMany !== "function") {
      console.warn(
        `Model ${modelNameCamel} (from ${modelFile}) not found in Prisma client or does not support deleteMany. Skipping deletion.`
      );
      continue;
    }

    try {
      const { count } = await model.deleteMany({});
      console.log(
        `Cleared ${count} records from ${toPascalCase(
          modelFile
        )} (${modelNameCamel})`
      );
    } catch (error) {
      console.error(
        `Error clearing data from ${toPascalCase(
          modelFile
        )} (${modelNameCamel}):`,
        error
      );
    }
  }
  console.log("Finished deleting data.");
}

async function main() {
  console.log("Starting seeding process...");
  const dataDirectory = path.join(__dirname, "seed-data");

  const orderedModelFileNames = [
    "user.json",
    "category.json",
    "tag.json",
    "post.json",
    "post-category.json",
    "post-tag.json",
    "comment.json",
    "reaction.json",
    "role-request.json",
  ];

  await deleteAllData(orderedModelFileNames);

  console.log("Starting to seed data from individual JSON files...");

  for (const modelFile of orderedModelFileNames) {
    const modelNameCamel = toCamelCase(modelFile);
    const modelNamePascal = toPascalCase(modelFile);

    const individualJsonFilePath = path.join(dataDirectory, modelFile);

    if (!fs.existsSync(individualJsonFilePath)) {
      console.warn(
        `Data file ${individualJsonFilePath} not found. Skipping seeding for ${modelNamePascal}.`
      );
      continue;
    }

    let dataToSeed;
    try {
      const fileContent = fs.readFileSync(individualJsonFilePath, "utf-8");
      dataToSeed = JSON.parse(fileContent);
      console.log(`Successfully read and parsed ${modelFile}.`);
    } catch (parseError) {
      console.error(
        `Error parsing JSON from ${individualJsonFilePath}:`,
        parseError
      );
      continue;
    }

    const model = (prisma as any)[modelNameCamel];

    if (!model || typeof model.create !== "function") {
      console.warn(
        `Model ${modelNameCamel} (derived from ${modelFile}) not found in Prisma client or does not support create. Skipping seeding.`
      );
      continue;
    }

    if (!Array.isArray(dataToSeed)) {
      console.warn(
        `Data in ${modelFile} is not an array. Skipping seeding for ${modelNamePascal}.`
      );
      continue;
    }

    if (dataToSeed.length === 0) {
      console.log(
        `No records to seed for ${modelNamePascal} from ${modelFile}.`
      );
      continue;
    }

    console.log(
      `Seeding data for ${modelNamePascal} from ${modelFile} (${dataToSeed.length} records)...`
    );
    let seededCount = 0;
    for (const item of dataToSeed) {
      try {
        await model.create({
          data: item,
        });
        seededCount++;
      } catch (error) {
        console.error(
          `Error seeding item for ${modelNamePascal} from ${modelFile}. Item:`,
          JSON.stringify(item),
          "\nError:",
          error
        );
      }
    }
    console.log(
      `Successfully seeded ${seededCount}/${dataToSeed.length} records for ${modelNamePascal} from ${modelFile}.`
    );

    await sleep(200);
  }
  console.log("Seeding process completed.");
}

main()
  .catch((e) => {
    console.error("Unhandled error in main seeding function:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });

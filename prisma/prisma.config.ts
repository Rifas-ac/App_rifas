import { PrismaClient } from "@prisma/client";

// Define a type for the configuration object
interface Config {
  seed: string;
}

// Use PrismaClient in your seed function or configuration
const prisma = new PrismaClient();

// Define a defineConfig function that accepts a configuration object
function defineConfig(config: Config) {
  return config;
}

export default defineConfig({
  seed: "ts-node prisma/seed.ts",
});

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedUsers(): Promise<void> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("example123", salt);

  const adminUser = await prisma.users.upsert({
    where: { email: "fred@flintstones.com" },
    update: {},
    create: {
      username: "fred",
      password: hashedPassword,
      email: "fred@flintstones.com",
      claims: ["admin", "user"]
    }
  });

  const user = await prisma.users.upsert({
    where: { email: "barney@flintstones.com" },
    update: {},
    create: {
      username: "barney",
      password: hashedPassword,
      email: "barney@flintstones.com",
      claims: ["user"]
    }
  });

  console.log("Seeded users", [adminUser, user]);
}

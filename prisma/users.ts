import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUsers(): Promise<void> {

  const adminUser = await prisma.users.upsert({
    where: { email: "fred@flintstones.com" },
    update: {},
    create: {
      username: "fred",
      email: "fred@flintstones.com",
      claims: ["admin", "user"],
      sub: "123456789"
    }
  });

  const user = await prisma.users.upsert({
    where: { email: "barney@flintstones.com" },
    update: {},
    create: {
      username: "barney",
      email: "barney@flintstones.com",
      claims: ["user"],
      sub: "987654321"
    }
  });

  console.log("Seeded users", [adminUser, user]);
}

import { Request, Response } from "express";
import { prisma } from "@/services/db.js";
import { objectIdSchema } from "@/zod.js";

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        claims: true
      }
    });

    await res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error retrieving users",
      error: err
    });
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    // Validate the request params and throw error if ObjectId is invalid
    objectIdSchema.parse(req.params.id);

    // Fetch result from DB
    const user = await prisma.users.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        id: true,
        email: true,
        username: true,
        claims: true
      }
    });

    await res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error retrieving user",
      error: err
    });
  }
}

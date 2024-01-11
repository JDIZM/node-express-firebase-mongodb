import { Request, Response } from "express";
import { prisma } from "@/services/db.js";
import { objectIdSchema } from "@/zod.js";
import { setFirebaseClaims } from "../auth/auth.handlers.ts";

export async function getUserBySub(sub: string) {
  const user = await prisma.users.findUnique({
    where: {
      sub
    }
  });
  return user;
}

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

export async function setUserPermissions(req: Request, res: Response) {
  try {
    console.log("req.body", req.body);

    const { id = "", sub = "", claims = [] } = req.body as { id: string; sub: string; claims: string[] };

    const updatedUser = await setFirebaseClaims(sub, claims, id);

    const user = await prisma.users.update({
      where: {
        id
      },
      data: {
        claims,
        sub
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    await res.status(200).send({ user, updatedUser });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      await res.status(400).send({ error: "Bad Request", message: error.message });
    }
  }
}

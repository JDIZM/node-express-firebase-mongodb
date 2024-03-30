import { gatewayResponse } from "@/helpers/response.ts";
import { Request, Response } from "express";
import { prisma } from "@/services/db.js";
import { objectIdSchema } from "@/zod.js";
import { setFirebaseClaims } from "../auth/auth.handlers.ts";
import { Users } from "@prisma/client";

export async function getUserBySub(sub: string): Promise<Users | null> {
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

    const response = gatewayResponse<typeof users>().success(200, users);

    res.status(response.code).send(response);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      const response = gatewayResponse().error(400, err, "Error retrieving users");

      res.status(response.code).send(response);
    }

    res.status(500).send("Internal Server Error");
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

    const response = gatewayResponse<typeof user>().success(200, user);

    res.status(response.code).send(response);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      const response = gatewayResponse().error(400, err, "Error retrieving user");

      res.status(response.code).send(response);
    }

    const response = gatewayResponse().error(500, new Error("Internal Server Error"), "Error retrieving user");

    res.status(response.code).send(response);
  }
}

export async function setUserPermissions(req: Request, res: Response): Promise<void> {
  try {
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

    const response = gatewayResponse<{
      user: typeof user;
      updatedUser: typeof updatedUser;
    }>().success(200, { user, updatedUser });

    res.status(response.code).send(response);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      const response = gatewayResponse().error(400, error, "Error updating user permissions");
      res.status(response.code).send(response);
    }

    const response = gatewayResponse().error(
      500,
      new Error("Internal Server Error"),
      "Error updating user permissions"
    );

    res.status(response.code).send(response);
  }
}

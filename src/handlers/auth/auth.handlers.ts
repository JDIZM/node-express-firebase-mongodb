import { gatewayResponse } from "@/helpers/response.ts";
import { app } from "@/services/firebase.js";
import { Request, Response } from "express";
import { DecodedIdToken, UserRecord, getAuth } from "firebase-admin/auth";

export async function setFirebaseClaims(sub: string, claims: string[], userId: string): Promise<UserRecord> {
  const auth = getAuth(app);
  await auth.setCustomUserClaims(sub, { claims, userId });
  const updatedUser = await auth.getUser(sub);
  return updatedUser;
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  // verify firebase token
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=en#verify_id_tokens_using_the_firebase_admin_sdk

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("A token is required for authentication");
    return;
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(token);

    const response = gatewayResponse<DecodedIdToken>().success(200, decodedToken);

    res.status(response.code).send(response);
  } catch (error) {
    if (error instanceof Error) {
      const response = gatewayResponse().error(400, error, "Failed to verify token");

      res.status(response.code).send(response);
    }

    const response = gatewayResponse().error(500, new Error("Internal Server Error"), "Internal Server Error");

    res.status(response.code).send(response);
  }
}

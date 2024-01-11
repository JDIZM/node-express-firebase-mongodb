import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/services/firebase.js";

export async function setFirebaseClaims(sub: string, claims: string[], userId: string) {
  const auth = getAuth(app);
  await auth.setCustomUserClaims(sub, { claims, userId });
  const updatedUser = await auth.getUser(sub);
  return updatedUser;
}

export async function verifyToken(req: Request, res: Response) {
  // verify firebase token
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=en#verify_id_tokens_using_the_firebase_admin_sdk

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(token);
    return res.send({
      decodedToken
    });
  } catch (error) {
    return res.send(error);
  }
}

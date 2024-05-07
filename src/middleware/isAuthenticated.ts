import { Route, permissions } from "@/helpers/permissions.ts";
import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/services/firebase.ts";

// https://stackabuse.com/bytes/how-to-get-a-users-ip-address-in-express-js/
const getIpFromRequest = (req: Request): string | undefined => {
  const ips =
    req.headers["cf-connecting-ip"] ?? req.headers["x-real-ip"] ?? req.headers["x-forwarded-for"] ?? req.ip ?? "";

  const res = ips instanceof Array ? ips : ips.split(",");
  const result = res[0]?.trim();
  return result;
};

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const routeKey = req.baseUrl + req.route.path;
  const routePermissions = permissions.get(routeKey as Route);

  const ips = getIpFromRequest(req);
  console.log("ip address:", ips);

  if (!routePermissions?.length) {
    return next();
  }

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    // Verify token using your auth service. eg Firebase.
    // Custom claims will need to be set for the user using the setFirebaseClaims function and permissions endpoint.
    const verified = await getAuth(app).verifyIdToken(token, true);
    console.log("verified", verified);

    // Attach user to res.locals and verify permissions in isAuthorized middleware
    res.locals = { id: verified.uid, sub: verified.sub, claims: verified.claims };

    return next();
  } catch (error) {
    return res.status(401).send(error);
  }
};

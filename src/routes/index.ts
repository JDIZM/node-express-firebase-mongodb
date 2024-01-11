import { Application } from "express";
import { test } from "@/helpers/index.js";
import { verifyToken } from "@/handlers/auth/auth.handlers.js";
import { getUsers, getUser, setUserPermissions } from "@/handlers/users/users.handlers.js";
import { isAuthenticated } from "@/middleware/isAuthenticated.ts";
import { isAuthorized } from "@/middleware/isAuthorized.ts";
import { API_ROUTES } from "@/helpers/permissions.ts";

export function routes(app: Application) {
  app.get(API_ROUTES.root, isAuthenticated, isAuthorized, (req, res) => {
    res.send(`Routes are active! route: ${API_ROUTES.root} with test ${test}`);
  });
  // /auth
  app.get(API_ROUTES.verifyAuthToken, isAuthenticated, isAuthorized, verifyToken);
  // /users
  app.get(API_ROUTES.users, isAuthenticated, isAuthorized, getUsers);
  app.get(API_ROUTES.userById, isAuthenticated, isAuthorized, getUser);
  app.post(API_ROUTES.setUsersPermissions, isAuthenticated, isAuthorized, setUserPermissions);
}

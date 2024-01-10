import { Application } from "express";
import { test } from "@/helpers/index.js";
import { getUsers, getUser } from "@/handlers/users/users.handlers.js";
import { isAuthenticated } from "@/middleware/isAuthenticated.ts";
import { isAuthorized } from "@/middleware/isAuthorized.ts";

export const API_ROUTES = {
  root: "/",
  users: "/users",
  userById: "/users/:id"
};

export function routes(app: Application) {
  app.get(API_ROUTES.root, isAuthenticated, isAuthorized, (req, res) => {
    res.send(`Routes are active! route: ${API_ROUTES.root} with test ${test}`);
  });
  app.get(API_ROUTES.users, isAuthenticated, isAuthorized, getUsers);
  app.get(API_ROUTES.userById, isAuthenticated, isAuthorized, getUser);
}

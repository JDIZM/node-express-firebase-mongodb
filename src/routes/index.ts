import { Application } from "express";
import { test } from "@/helpers/index.js";

export const API_ROUTES = {
  root: "/",
  example: "/example"
};

export function routes(app: Application) {
  app.get(API_ROUTES.root, (req, res) => {
    res.send(`Routes are active! route: ${API_ROUTES.root} with test ${test}`);
  });
  app.get(API_ROUTES.example, (req, res) => {
    res.send(`Routes are active! route: ${API_ROUTES.example}`);
  });
}

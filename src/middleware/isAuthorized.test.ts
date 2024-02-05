import { describe, expect, it, beforeEach } from "vitest";
import { isAuthorized } from "./isAuthorized.js";
import { NextFunction } from "express";

const USER_OBJECT_ID = "656b874c4c5f8e56690b3c9d";

describe("isAuthorized", () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      baseUrl: "/",
      route: {
        path: "users"
      }
    };

    res = {
      locals: {
        id: USER_OBJECT_ID,
        sub: USER_OBJECT_ID,
        claims: ["user"]
      },
      status: (code: number) => {
        return {
          send: (message: string) => {
            return message;
          }
        };
      }
    };

    next = () => {
      return "next";
    };
  });

  describe("when the user is not logged in and has no permissions", () => {
    it("should deny access if the user has no id", async () => {
      res.locals.id = undefined;

      const result = await isAuthorized(req, res, next);
      expect(result).toEqual("Unauthorized");
    });

    it("should deny access if the user has no sub", async () => {
      res.locals.sub = undefined;

      const result = await isAuthorized(req, res, next);
      expect(result).toEqual("Unauthorized");
    });

    it("should deny access if the user has no claims", async () => {
      res.locals.claims = [];

      const result = await isAuthorized(req, res, next);
      expect(result).toEqual("Unauthorized");
    });
  });

  describe("when the user is logged in with permissions", () => {
    it("should allow access to a route with no permissions", async () => {
      req = {
        baseUrl: "/",
        route: {
          path: ""
        }
      };

      res.locals.claims = [];

      const result = await isAuthorized(req, res, next);
      expect(result).toEqual("next");
    });

    describe("admin permissions", () => {
      it("should allow access to a route with admin permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "users"
          }
        };

        res.locals.claims = ["admin"];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("next");
      });

      it("should deny access to an admin only route without admin permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "users"
          }
        };

        res.locals.claims = ["user"];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("Unauthorized");
      });
    });
    describe("owner permissions", () => {
      it("should allow access to a route with owner permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "users/:id"
          },
          params: { id: USER_OBJECT_ID }
        };

        res.locals.claims = ["user"];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("next");
      });

      it("should deny access to an owner only route without owner permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "users/:id"
          },
          params: { id: "some-other-id-that-is-not-the-users" }
        };

        res.locals.claims = ["user"];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("Unauthorized");
      });
    });
    describe("user permissions", () => {
      it("should allow access to a route with user permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "auth/verify-token"
          }
        };

        res.locals.claims = ["user"];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("next");
      });

      it("should deny access to a user only route without user permissions", async () => {
        req = {
          baseUrl: "/",
          route: {
            path: "auth/verify-token"
          }
        };

        res.locals.claims = [];

        const result = await isAuthorized(req, res, next);
        expect(result).toEqual("Unauthorized");
      });
    });
  });
});

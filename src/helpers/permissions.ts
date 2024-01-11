export const API_ROUTES = {
  root: "/",
  users: "/users",
  userById: "/users/:id",
  setUsersPermissions: "/users/set-permissions",
  verifyAuthToken: "/auth/verify-token"
} as const;

export type RouteName = keyof typeof API_ROUTES;
export type Route = (typeof API_ROUTES)[RouteName];

export const roles = ["admin", "user", "owner"] as const;
export type Claim = (typeof roles)[number];

export const permissions = new Map<Route, Claim[]>();

permissions.set(API_ROUTES.root, ["user"]);
permissions.set(API_ROUTES.verifyAuthToken, ["user"]);
permissions.set(API_ROUTES.users, ["admin"]);
permissions.set(API_ROUTES.userById, ["owner"]);
permissions.set(API_ROUTES.setUsersPermissions, ["admin"]);

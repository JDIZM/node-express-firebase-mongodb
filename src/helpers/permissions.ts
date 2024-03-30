export const API_ROUTES = {
  root: "/",
  users: "/users",
  userById: "/users/:id",
  setUsersPermissions: "/users/set-permissions",
  verifyAuthToken: "/auth/verify-token"
} as const;

export type RouteName = keyof typeof API_ROUTES;
export type Route = (typeof API_ROUTES)[RouteName];
export type Routes = Route[];

export const roles = ["admin", "user", "owner"] as const;
export type Claim = (typeof roles)[number];

export const permissions = new Map<Route, Claim[]>();
export type PermissionsMap = typeof permissions;

permissions.set(API_ROUTES.root, []);
permissions.set(API_ROUTES.verifyAuthToken, ["user"]);
permissions.set(API_ROUTES.users, ["admin"]);
permissions.set(API_ROUTES.userById, ["owner"]);
permissions.set(API_ROUTES.setUsersPermissions, ["admin"]);

/**
 * This validates that permissions are set for all routes
 * in the permissions map.
 *
 */
export const hasRoutesWithNoPermissionsSet = (routes: Routes, permissions: PermissionsMap): boolean => {
  const permissionRoutes = [...permissions.keys()];

  const hasInvalidRoute = routes.some((route) => {
    return !permissionRoutes.includes(route);
  });

  return hasInvalidRoute;
};

const hasInvalidRoute = hasRoutesWithNoPermissionsSet(Object.values(API_ROUTES), permissions);

if (hasInvalidRoute) {
  throw new Error("There are routes without permissions set.");
}

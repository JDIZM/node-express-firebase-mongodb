import { initializeApp, applicationDefault } from "firebase-admin/app";

// see: https://firebase.google.com/docs/admin/setup for more info on setting up the firebase admin sdk
export const app = initializeApp({
  // specify some options.
  credential: applicationDefault()
});

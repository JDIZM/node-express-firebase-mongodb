import dotenv from "dotenv";

const ENV = process.env.NODE_ENV ?? "development";

console.log("mode:", ENV);

if (ENV !== "production") {
  dotenv.config();
}

export const config = {
  env: ENV,
  port: process.env.PORT || 4000
};

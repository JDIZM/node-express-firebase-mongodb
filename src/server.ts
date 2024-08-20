import express from "express";
import { pinoHttp } from "pino-http";
import { config } from "./config.js";
import { routes } from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./helpers/cors.ts";

const { logger } = pinoHttp();

console.log("config", config);

const checkConfigIsValid = () => {
  Object.values(config).forEach((value) => {
    if (!value) {
      throw new Error("config is invalid");
    }
  });
};

checkConfigIsValid();

const app = express();

//
// Middleware
//

// Logger
app.use(
  pinoHttp({
    logger
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false
  })
);
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//
// Routes
//
routes(app);

app.listen(config.port, () => {
  logger.info(`[server]: Server is running on port: ${config.port}`);
});

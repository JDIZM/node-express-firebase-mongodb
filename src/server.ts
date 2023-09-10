3; // const express = require("express");
import express = require("express");
// import morgan = require("morgan");
// const dotenv = require("dotenv");

// dotenv.config();

const app = express();
// const port = process.env.PORT;
const port = 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

"use strict";
import dotenv from "dotenv";
import express from "express";
import initRoute from "./routes/index";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", initRoute);

app.listen(6000, (err) => {
  if (err) {
    console.log("Error while running express server.");
    return;
  }
  console.log("Server running on port 6000.");
});

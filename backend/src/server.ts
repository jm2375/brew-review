import cors from "cors";
import express from "express";

import router from "./api/breweries.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/breweries", router);
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;

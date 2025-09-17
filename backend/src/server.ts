import express from "express";
import cors from "cors";
import breweries from "./api/breweries.route.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/breweries", breweries);
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;

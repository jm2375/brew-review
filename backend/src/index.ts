import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import BreweriesDAO from "./dao/breweriesDAO.js";
import CommentsDAO from "./dao/commentsDAO.js";
import app from "./server.js";

async function main(): Promise<void> {
  dotenv.config();

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(mongoUri);
  const port = process.env.BACKEND_PORT ?? 5000;

  await client.connect();
  await BreweriesDAO.injectDB(client);
  await CommentsDAO.injectDB(client);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port: ${port}`);
  });
}

main().catch((e) => {
  throw e;
});

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import app from "./server.ts";
import BreweriesDAO from "./dao/breweriesDAO.ts";
import CommentsDAO from "./dao/commentsDAO.ts";

async function main() {
  dotenv.config();

  const port = process.env.BACKEND_PORT;

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    await BreweriesDAO.injectDB(client);
    await CommentsDAO.injectDB(client);

    app.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);

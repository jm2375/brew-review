import { MongoClient, Collection, ObjectId } from "mongodb";

let breweries: Collection;

export default class BreweriesDAO {
  static async injectDB(conn: MongoClient) {
    if (breweries) {
      return;
    }

    try {
      breweries = await conn.db(process.env.DATABASE).collection("breweries");
    } catch (e) {
      console.error(
        `Unable to establish connection handle in BreweriesDAO: ${e}`,
      );
    }
  }

  static async getBreweries({
    filters = null,
    pageNumber = 0,
    itemsPerPage = 20,
  } = {}) {
    let cursor;
    let query = {};

    if (filters) {
      if ("name" in filters) {
        query = { name: { $eq: filters["name"] } };
      } else if ("brewery_type" in filters) {
        query = { brewery_type: { $eq: filters["brewery_type"] } };
      } else if ("city" in filters) {
        query = { city: { $eq: filters["city"] } };
      } else if ("state" in filters) {
        query = { state: { $eq: filters["state"] } };
      }
    }

    try {
      cursor = await breweries
        .find(query)
        .limit(itemsPerPage)
        .skip(itemsPerPage * pageNumber);

      const breweriesList = await cursor.toArray();
      const totalNumBreweries = await breweries.countDocuments(query);

      return { breweriesList, totalNumBreweries };
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { breweriesList: [], totalNumBreweries: 0 };
    }
  }

  static async getBreweryById(id: string) {
    try {
      return await breweries.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to issue find by id command: ${e}`);
      throw e;
    }
  }
}

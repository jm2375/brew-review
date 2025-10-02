import { ObjectId } from "mongodb";

import type { Collection, MongoClient } from "mongodb";

import type { Brewery, GetBreweriesParams } from "../types/index.js";

type BreweryWithId = Omit<Brewery, "_id"> & { id: string };

interface GetBreweriesResult {
  breweriesList: BreweryWithId[];
  totalNumBreweries: number;
}

let breweries: Collection<Brewery>;

export default class BreweriesDAO {
  static async injectDB(conn: MongoClient): Promise<void> {
    if (breweries) {
      return;
    }

    const dbName = process.env.DATABASE;
    if (!dbName) {
      throw new Error("DATABASE environment variable is not set");
    }
    breweries = conn.db(dbName).collection<Brewery>("breweries");
  }

  static async getBreweries({
    filters = null,
    pageNumber = 0,
    itemsPerPage = 20,
  }: GetBreweriesParams = {}): Promise<GetBreweriesResult> {
    if (!breweries) {
      throw new Error("Database not initialized");
    }

    let query: Record<string, unknown> = {};

    if (filters) {
      if (filters.name) {
        query = { name: { $regex: filters.name, $options: "i" } };
      } else if (filters.brewery_type) {
        query = {
          brewery_type: { $regex: filters.brewery_type, $options: "i" },
        };
      } else if (filters.city) {
        query = { city: { $regex: filters.city, $options: "i" } };
      } else if (filters.state) {
        query = { state: { $regex: filters.state, $options: "i" } };
      }
    }

    try {
      const cursor = breweries
        .find(query)
        .limit(itemsPerPage)
        .skip(itemsPerPage * pageNumber);

      const breweriesList = (await cursor.toArray()).map((brewery) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _id, ...rest } = brewery;
        return {
          ...rest,
          id: _id.toString(),
        };
      });
      const totalNumBreweries = await breweries.countDocuments(query);

      return { breweriesList, totalNumBreweries };
    } catch {
      return { breweriesList: [], totalNumBreweries: 0 };
    }
  }

  static async getBreweryById(id: string): Promise<BreweryWithId | null> {
    if (!breweries) {
      throw new Error("Database not initialized");
    }

    const brewery = await breweries.findOne({ _id: new ObjectId(id) });
    if (!brewery) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...rest } = brewery;
    return {
      ...rest,
      id: _id.toString(),
    };
  }
}

import { Request, Response, NextFunction } from "express";
import BreweriesDAO from "../dao/breweriesDAO.ts";

interface BreweryFilters {
  name?: string;
  brewery_type?: string;
  city?: string;
  state?: string;
}

export default class BreweriesController {
  static async apiGetBreweries(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const itemsPerPage = req.query.itemsPerPage
      ? parseInt(req.query.itemsPerPage as string)
      : 20;
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 0;

    const filters: BreweryFilters = {};

    if (req.query.name) {
      filters.name = req.query.name as string;
    } else if (req.query.brewery_type) {
      filters.brewery_type = req.query.brewery_type as string;
    } else if (req.query.city) {
      filters.city = req.query.city as string;
    } else if (req.query.state) {
      filters.state = req.query.state as string;
    }

    const { breweriesList, totalNumBreweries } =
      await BreweriesDAO.getBreweries({
        filters,
        pageNumber,
        itemsPerPage,
      });

    const response = {
      breweries: breweriesList,
      page: pageNumber,
      filters: filters,
      entries_per_page: itemsPerPage,
      total_results: totalNumBreweries,
    };

    res.json(response);
  }

  static async apiGetBreweryById(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const id = req.params.id || {};
      const brewery = await BreweriesDAO.getBreweryById(id as string);

      if (!brewery) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json(brewery);
    } catch (e) {
      console.log(`API Error, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}

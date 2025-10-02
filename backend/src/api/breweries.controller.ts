import BreweriesDAO from "../dao/breweriesDAO.js";

import type { NextFunction, Request, Response } from "express";

import type { BreweryFilters } from "../types/index.js";

export default class BreweriesController {
  static async apiGetBreweries(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    const filters: BreweryFilters = {};

    const itemsPerPage = req.query.itemsPerPage
      ? parseInt(req.query.itemsPerPage as string, 10)
      : 20;
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string, 10)
      : 0;

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
      filters,
      entries_per_page: itemsPerPage,
      total_results: totalNumBreweries,
    };

    res.json(response);
  }

  static async apiGetBreweryById(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Brewery ID is required" });
        return;
      }

      const brewery = await BreweriesDAO.getBreweryById(id);

      if (!brewery) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json(brewery);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}

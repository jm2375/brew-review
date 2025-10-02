import CommentsDAO from "../dao/commentsDAO.js";

import type { NextFunction, Request, Response } from "express";

export default class CommentsController {
  static async apiGetCommentsByBreweryId(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    try {
      const breweryId = req.params.id;
      if (!breweryId) {
        res.status(400).json({ error: "Brewery ID is required" });
        return;
      }
      const result = await CommentsDAO.getCommentsByBreweryId(breweryId);

      if ("error" in result) {
        res.status(500).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  static async apiPostComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    try {
      const breweryId = req.body.brewery_id as string | undefined;
      const text = req.body.text as string | undefined;
      const name = req.body.name as string | undefined;
      const userId = req.body.user_id as string | undefined;

      if (!breweryId || !text || !name || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const userInfo = {
        name,
        id: userId,
      };
      const date = new Date();

      const result = await CommentsDAO.addComment(
        breweryId,
        userInfo,
        text,
        date,
      );

      if ("error" in result) {
        res.status(500).json({ error: result.error });
        return;
      }

      res.json({ status: "Success" });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  static async apiUpdateComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    try {
      const commentId = req.body.comment_id as string | undefined;
      const userId = req.body.user_id as string | undefined;
      const text = req.body.text as string | undefined;

      if (!commentId || !userId || !text) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const date = new Date();

      const commentResponse = await CommentsDAO.updateComment(
        commentId,
        userId,
        text,
        date,
      );

      if ("error" in commentResponse) {
        res.status(400).json({ error: commentResponse.error });
        return;
      }

      if (commentResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update comment. User may not be original poster",
        );
      }

      res.json({ status: "Success" });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  static async apiDeleteComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> {
    try {
      const commentId = req.body.comment_id as string | undefined;
      const userId = req.body.user_id as string | undefined;

      if (!commentId || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const result = await CommentsDAO.deleteComment(commentId, userId);

      if ("error" in result) {
        res.status(500).json({ error: result.error });
        return;
      }

      res.json({ status: "Success" });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}

import { Request, Response, NextFunction } from "express";
import CommentsDAO from "../dao/commentsDAO.ts";

export default class CommentsController {
  static async apiGetCommentsByBreweryId(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const breweryId = req.params.id as string;
      const comments = await CommentsDAO.getCommentsByBreweryId(breweryId);
      res.json(comments);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  static async apiPostComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const breweryId = req.body.brewery_id;
      const text = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.userId,
      };
      const date = new Date();

      await CommentsDAO.addComment(breweryId, userInfo, text, date);

      res.json({ status: "Success" });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  static async apiUpdateComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const commentId = req.body.comment_id;
      const userId = req.body.userId;
      const text = req.body.text;
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
      res.status(500).json({ error: (e as Error).message });
    }
  }

  static async apiDeleteComment(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const commentId = req.body.comment_id;
      const userId = req.body.userId;

      await CommentsDAO.deleteComment(commentId, userId);

      res.json({ status: "Success" });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }
}

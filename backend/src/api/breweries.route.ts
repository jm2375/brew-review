import express from "express";
import BreweriesController from "./breweries.controller.ts";
import CommentsController from "./comments.controller.ts";

const router = express.Router();

router.route("/").get(BreweriesController.apiGetBreweries);
router.route("/id/:id").get(BreweriesController.apiGetBreweryById);

router
  .route("/comment")
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

router
  .route("/id/:id/comments")
  .get(CommentsController.apiGetCommentsByBreweryId);

export default router;

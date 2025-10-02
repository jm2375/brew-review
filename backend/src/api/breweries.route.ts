import express from "express";

import BreweriesController from "./breweries.controller.js";
import CommentsController from "./comments.controller.js";

const router = express.Router();

router.route("/").get(BreweriesController.apiGetBreweries);
router.route("/:id").get(BreweriesController.apiGetBreweryById);

router.route("/:id/comments").get(CommentsController.apiGetCommentsByBreweryId);

router
  .route("/comment")
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

export default router;

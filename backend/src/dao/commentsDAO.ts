import { ObjectId } from "mongodb";

import type {
  Collection,
  DeleteResult,
  MongoClient,
  UpdateResult,
} from "mongodb";

import type { Comment, User } from "../types/index.js";

type CommentWithId = Omit<Comment, "_id"> & { id: string };

let comments: Collection<Comment>;

export default class CommentsDAO {
  static async injectDB(conn: MongoClient): Promise<void> {
    if (comments) {
      return;
    }

    const dbName = process.env.DATABASE;
    if (!dbName) {
      throw new Error("DATABASE environment variable is not set");
    }
    comments = conn.db(dbName).collection<Comment>("comments");
  }

  static async getCommentsByBreweryId(
    breweryId: string,
  ): Promise<CommentWithId[] | { error: string }> {
    if (!comments) {
      throw new Error("Database not initialized");
    }

    try {
      const cursor = comments
        .find({
          brewery_id: new ObjectId(breweryId),
        })
        .sort({ lastModified: -1 });

      const commentsList = await cursor.toArray();
      return commentsList.map((comment) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _id, ...rest } = comment;
        return {
          ...rest,
          id: _id.toString(),
        };
      });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      return { error: errorMessage };
    }
  }

  static async addComment(
    breweryId: string,
    user: User,
    text: string,
    date: Date,
  ): Promise<
    { acknowledged: boolean; insertedId: ObjectId } | { error: string }
  > {
    if (!comments) {
      throw new Error("Database not initialized");
    }

    try {
      const commentDoc = {
        brewery_id: new ObjectId(breweryId),
        name: user.name,
        user_id: user.id,
        text,
        lastModified: date,
      } as Omit<Comment, "_id">;

      return await comments.insertOne(commentDoc as Comment);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      return { error: errorMessage };
    }
  }

  static async updateComment(
    commentId: string,
    userId: string,
    text: string,
    date: Date,
  ): Promise<UpdateResult | { error: string }> {
    if (!comments) {
      throw new Error("Database not initialized");
    }

    try {
      const updateResponse = await comments.updateOne(
        {
          _id: new ObjectId(commentId),
          user_id: userId,
        },
        {
          $set: {
            text,
            lastModified: date,
          },
        },
      );

      return updateResponse;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      return { error: errorMessage };
    }
  }

  static async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<DeleteResult | { error: string }> {
    if (!comments) {
      throw new Error("Database not initialized");
    }

    try {
      const deleteResponse = await comments.deleteOne({
        _id: new ObjectId(commentId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      return { error: errorMessage };
    }
  }
}

import { MongoClient, Collection, ObjectId } from 'mongodb';

let comments: Collection;

export default class CommentsDAO {
    static async injectDB(conn: MongoClient) {
        if (comments) {
            return;
        }

        try {
            comments = await conn.db(process.env.DATABASE).collection("comments");
        }
        catch (e) {
            console.error(`Unable to establish connection handle in CommentsDAO: ${e}`);
        }
    }

    static async getCommentsByBreweryId(breweryId: string) {
        try {
            const cursor = await comments.find({ 
                brewery_id: new ObjectId(breweryId) 
            }).sort({ lastModified: -1 });

            return await cursor.toArray();
        }
        catch (e) {
            console.error(`Unable to get comments: ${e}`);
            return { error: e };
        }
    }

    static async addComment(breweryId: string, user: { name: string, _id: string }, text: string, date: Date) {
        try {
            const commentDoc = {
                brewery_id: new ObjectId(breweryId),
                name: user.name,
                userId: user._id,
                text: text,
                lastModified: date
            };

            return await comments.insertOne(commentDoc);
        }
        catch (e) {
            console.error(`Unable to post comment: ${e}`);
            return { error: e };
        }
    }

    static async updateComment(commentId: string, userId: string, text: string, date: Date) {
        try {
            const updateResponse = await comments.updateOne(
                {
                    _id: new ObjectId(commentId),
                    userId: userId
                },
                {
                    $set: {
                        text: text,
                        lastModified: date
                    }
                }
            );

            return updateResponse;
        }
        catch (e) {
            console.error(`Unable to update comment: ${e}`);
            return { error: e };
        }
    }

    static async deleteComment(commentId: string, userId: string) {
        try {
            const deleteResponse = await comments.deleteOne({
                _id: new ObjectId(commentId),
                userId: userId
            });

            return deleteResponse;
        }
        catch (e) {
            console.error(`Unable to delete comment: ${e}`);
            return { error: e };
        }
    }
}

const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeCommentRepository = require('../../Domains/like_comment/LikeCommentRepository');
const PostedLike = require('../../Domains/like_comment/entities/PostedLike');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }
    
    async addLikeComment(newLikeComment) {
        const { commentId, userId, threadId } = newLikeComment;
        const id = `like-comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4) RETURNING id, "userId", "commentId"',
            values: [id, userId, commentId, threadId],
        };

        const result = await this._pool.query(query);

        return new PostedLike({ ...result.rows[0] });
    }

    async verifyLikeComment(id, userId) {
        const query = {
            text: 'SELECT * FROM user_comment_likes WHERE id = $1 AND "userId" = $2',
            values: [id, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }

    }

    async deleteLikeComment(commentId, userId) {
        const query = {
            text: 'DELETE FROM user_comment_likes WHERE "commentId" = $1 AND "userId" = $2 RETURNING id',
            values: [commentId, userId],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('tidak ada like yang ditemukan pada comment ini');
        }
    }

    async getNumberOfLikedComments(threadId) {
        const query = {
            text: 'SELECT * FROM user_comment_likes WHERE "threadId" = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async checkIsLiked(commentId, userId) {
        const query = {
            text: 'SELECT * FROM user_comment_likes WHERE "userId" = $1 AND "commentId" = $2',
            values: [userId, commentId],
        };

        const result = await this._pool.query(query);

        return result.rowCount;
    }
}

module.exports = LikeCommentRepositoryPostgres;

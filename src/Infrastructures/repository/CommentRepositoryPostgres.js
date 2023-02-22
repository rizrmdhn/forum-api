const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comment/CommentRepository');
const PostedComment = require('../../Domains/comment/entities/PostedComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, owner, threadId } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comment VALUES($1, $2, $3, FALSE, $4, $5) RETURNING id, content, "ownerId" AS owner',
            values: [id, content, date, owner, threadId],

        };

        const result = await this._pool.query(query);

        return new PostedComment({ ...result.rows[0] });
    }

    async checkAvailabilityComment(id) {
        const query = {
            text: 'SELECT id FROM comment WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async verifyCommentOwner(id, owner) {
        const query = {
            text: 'SELECT id FROM comment WHERE id = $1 AND "ownerId" = $2',
            values: [id, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak bisa menghapus komentar orang lain');
        }
    }

    async deleteComment(id) {
        const query = {
            text: 'UPDATE comment SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        };

        await this._pool.query(query);
    }

    async getCommentsThread(threadId) {
        const query = {
            text: `SELECT comment.id, users.username, comment.date, comment.content, comment.is_deleted
            FROM comment
            LEFT JOIN users ON users.id = comment."ownerId"
            WHERE "threadId" = $1 ORDER BY comment.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;
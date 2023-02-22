const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const PostedReply = require('../../Domains/reply/entities/PostedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, owner, commentId, threadId } = newReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO reply VALUES($1, $2, $3, FALSE, $4, $5, $6) RETURNING id, content, "ownerId" AS owner',
            values: [id, content, date, owner, commentId, threadId],
        };

        const result = await this._pool.query(query);

        return new PostedReply({ ...result.rows[0] });
    }

    async checkAvailabilityReply(id) {
        const query = {
            text: 'SELECT id FROM reply WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async verifyReplyOwner(id, owner) {
        const query = {
            text: 'SELECT id FROM reply WHERE id = $1 AND "ownerId" = $2',
            values: [id, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak bisa menghapus balasan orang lain');
        }
    }

    async deleteReply(id) {
        const query = {
            text: 'UPDATE reply SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        };

        await this._pool.query(query);
    }

    async getCommentReplies(commentId) {
        const query = {
            text: `SELECT reply.id, content, date, users.username, is_deleted
            FROM reply
            LEFT JOIN users ON users.id = reply."ownerId"
            WHERE "commentId" = $1 ORDER BY date ASC`,
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async getCommentRepliesByThreadId(threadId) {
        const query = {
            text: `SELECT reply.id, reply.content, reply.date, users.username, reply.is_deleted
            FROM reply
            INNER JOIN thread ON thread.id = reply."threadId"
            LEFT JOIN users ON users.id = reply."ownerId"
            WHERE thread.id = $1 ORDER BY reply.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = ReplyRepositoryPostgres;
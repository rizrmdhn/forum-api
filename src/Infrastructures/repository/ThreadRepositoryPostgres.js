const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const PostedThread = require('../../Domains/thread/entities/PostedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        const { title, body, ownerId } = newThread;
        const id = `thread-h_${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5) RETURNING id, title, "ownerId" AS owner',
            values: [id, title, body, date, ownerId],
        };

        const result = await this._pool.query(query);

        return new PostedThread({ ...result.rows[0] });
    }

    async checkAvailabilityThread(threadId) {
        const query = {
            text: 'SELECT id FROM thread WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }

    async getDetailThread(threadId) {
        const query = {
            text: `SELECT thread.id, title, body, date, username
            FROM thread
            LEFT JOIN users ON users.id = thread."ownerId"
            WHERE thread.id = $1`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
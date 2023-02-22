/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
    async addReply({
        id = 'reply-123', content = 'reply', date = new Date().toISOString(), owner = 'user-123', commentId = 'comment-123', threadId = 'thread-123'
    }) {
        const query = {
            text: 'INSERT INTO reply VALUES($1, $2, $3, FALSE, $4, $5, $6)',
            values: [id, content, date, owner, commentId, threadId],
        };

        await pool.query(query);
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM reply WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async checkIsDeletedReplyById(id) {
        const query = {
            text: 'SELECT is_deleted FROM reply WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        const isDeleted = result.rows[0].is_deleted;

        return isDeleted;
    },

    async deleteReply(id) {
        const query = {
            text: 'UPDATE reply SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        };
        
        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE reply');
    }
};

module.exports = ReplyTableTestHelper;
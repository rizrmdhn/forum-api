/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'content', date = new Date().toISOString(), owner = 'user-123', threadId = 'thread-123'
    }) {
        const query = {
            text: 'INSERT INTO comment VALUES($1, $2, $3, $4, $5)',
            values: [id, content, date, owner, threadId],
        };

        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comment WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comment CASCADE');
    }
};

module.exports = CommentTableTestHelper;
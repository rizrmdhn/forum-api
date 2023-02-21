/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
    async addReply({ 
        id = 'reply-123', content = 'reply', date = new Date().toISOString(), owner = 'user-123', commentId = 'comment-123'
    }) { 
        const query = {
            text: 'INSERT INTO reply VALUES($1, $2, $3, $4, $5)',
            values: [id, content, date, owner, commentId],
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

    async cleanTable() {
        await pool.query('TRUNCATE TABLE reply');
    }
};

module.exports = ReplyTableTestHelper;
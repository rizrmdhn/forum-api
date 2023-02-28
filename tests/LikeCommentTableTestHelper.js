/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');


const LikeCommentTableTestHelper = {
    async addLikeComment({ id = 'like-comment-123', owner = 'user-123', commentId = 'comment-123', threadId = 'thread-123'}) {
        const query = {
            text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4)',
            values: [id, owner, commentId, threadId],
        };

        await pool.query(query);
    },

    async findLikeCommentById(id) {
        const query = {
            text: 'SELECT * FROM user_comment_likes WHERE id = $1',
            values: [id],
        }

        const result = await pool.query(query);

        return result.rows;
    },

    async getNumberLikedComment(commentId) {
        const query = {
            text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);

        return result.rowCount;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE user_comment_likes');
    }
};

module.exports = LikeCommentTableTestHelper;
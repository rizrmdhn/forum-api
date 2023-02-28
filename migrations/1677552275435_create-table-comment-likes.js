exports.up = pgm => {
    pgm.createTable('user_comment_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        userId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        commentId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        threadId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('user_comment_likes');
};

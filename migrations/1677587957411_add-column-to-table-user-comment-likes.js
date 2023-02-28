exports.up = pgm => {
    pgm.addColumn('user_comment_likes', {
        threadId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
};

exports.down = pgm => { };

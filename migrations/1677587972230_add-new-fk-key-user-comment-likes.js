exports.up = pgm => {
    pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.threadId', 'FOREIGN KEY("threadId") REFERENCES thread(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.threadId');
};

exports.up = pgm => {
    pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.userId', 'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.commentId', 'FOREIGN KEY("commentId") REFERENCES comment(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.userId');
    pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.commentId');
 };

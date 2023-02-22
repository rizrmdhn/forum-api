/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.addConstraint('thread', 'fk_thread.ownerId', 'FOREIGN KEY("ownerId") REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comment', 'fk_comment.ownerId', 'FOREIGN KEY("ownerId") REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comment', 'fk_comment.threadId', 'FOREIGN KEY("threadId") REFERENCES thread(id) ON DELETE CASCADE');
    pgm.addConstraint('reply', 'fk_reply.ownerId', 'FOREIGN KEY("ownerId") REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('reply', 'fk_reply.commentId', 'FOREIGN KEY("commentId") REFERENCES comment(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('thread', 'fk_thread.ownerId');
    pgm.dropConstraint('comment', 'fk_comment.ownerId');
    pgm.dropConstraint('comment', 'fk_comment.threadId');
    pgm.dropConstraint('reply', 'fk_reply.ownerId');
    pgm.dropConstraint('reply', 'fk_reply.commentId');
};

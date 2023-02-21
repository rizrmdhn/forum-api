/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('reply', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
        ownerId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        commentId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('reply');
};
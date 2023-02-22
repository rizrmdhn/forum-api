/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comment', {
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
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            defaultValue: false,
        },
        ownerId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        threadId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comment');
};
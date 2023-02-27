exports.up = (pgm) => {
    pgm.createTable('thread', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        ownerId: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('thread');
};
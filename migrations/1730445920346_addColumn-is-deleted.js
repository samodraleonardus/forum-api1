exports.up = (pgm) => {
  ['comments', 'replies'].forEach((table) => {
    pgm.addColumn(table, {
      is_deleted: {
        type: 'BOOLEAN',
        notNull: true,
        default: false,
      },
    });
  });
};

exports.down = (pgm) => {
  ['comments', 'replies'].forEach((table) => {
    pgm.dropColumn(table, 'is_deleted');
  });
};

/* eslint-disable no-multiple-empty-lines */

exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE threads ALTER COLUMN date TYPE TIMESTAMPTZ USING date AT TIME ZONE 'UTC';
      ALTER TABLE comments ALTER COLUMN date TYPE TIMESTAMPTZ USING date AT TIME ZONE 'UTC';
      ALTER TABLE replies ALTER COLUMN date TYPE TIMESTAMPTZ USING date AT TIME ZONE 'UTC';
      ALTER TABLE likes ALTER COLUMN date TYPE TIMESTAMPTZ USING date AT TIME ZONE 'UTC';
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE threads ALTER COLUMN date TYPE TIMESTAMP;
      ALTER TABLE comments ALTER COLUMN date TYPE TIMESTAMP;
      ALTER TABLE replies ALTER COLUMN date TYPE TIMESTAMP;
      ALTER TABLE likes ALTER COLUMN date TYPE TIMESTAMP;
    `);
};

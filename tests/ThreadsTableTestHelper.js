/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async inputThread({
    id = "thread-123",
    owner = "user-123",
    title = 'Sample Thread Title',
    body = 'Sample Thread Body',
    date = '2024-10-10',
  }) {
    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4, $5)",
      values: [id, owner, title, body, date],
    };

    await pool.query(query);
  },

  async fetchThreadsById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;

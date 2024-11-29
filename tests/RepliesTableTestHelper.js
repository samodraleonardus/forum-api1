/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async inputReply({
    id = "reply-123",
    threadId = "thread-123",
    commentId = "comment-123",
    owner = "user-123",
    content = "content reply",
    date = "2024-11-10",
    is_deleted = false,
  }) {
    const query = {
      text: "INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values: [id, threadId, commentId, owner, content, date, is_deleted],
    };

    await pool.query(query);
  },

  async findReplyById(replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;

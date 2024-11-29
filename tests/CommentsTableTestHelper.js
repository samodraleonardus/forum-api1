/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async inputComment({
    id = "comment-123",
    threadId = "thread-123",
    owner = "user-123",
    content = "Comment content test",
    date = "2024-11-10",
    is_deleted = false,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6 )",
      values: [id, threadId, owner, content, date, is_deleted],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;

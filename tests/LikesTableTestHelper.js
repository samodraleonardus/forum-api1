/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', commentId = 'comment-123', owner = 'user-123', date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner, date) VALUES ($1, $2, $3, $4)',
      values: [id, commentId, owner, date],
    };
    await pool.query(query);
  },

  async findLikeByCommentAndOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async findAllLikes() {
    const query = {
      text: 'SELECT * FROM likes',
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes');
  },
};

module.exports = LikesTableTestHelper;

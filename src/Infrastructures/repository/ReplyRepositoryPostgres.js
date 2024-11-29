const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const ReplyOutput = require("../../Domains/replies/entities/ReplyOutput");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertReply({
    threadId, commentId, owner, content,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, owner, content",
      values: [id, threadId, commentId, owner, content, date],
    };

    const result = await this._pool.query(query);
    return new ReplyOutput(result.rows[0]);
  }

  async validateReplyExistence(replyId) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Reply tidak ditemukan");
    }
  }

  async checkReplyOwnership(replyId, owner) {
    const query = {
      text: "SELECT 1 FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async fetchReplyByThread(threadId) {
    const query = {
      text: `
        SELECT rp.id, rp.content, rp.date, us.username, rp.comment_id, rp.is_deleted 
        FROM replies rp 
        JOIN users us ON rp.owner = us.id 
        WHERE rp.thread_id = $1 
        ORDER BY rp.date ASC
      `,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((row) => ({
      ...row,
      date: row.date.toISOString(),
    }));
  }

  async removeReplyById(replyId) {
    const query = {
      text: "UPDATE replies SET is_deleted = TRUE WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;

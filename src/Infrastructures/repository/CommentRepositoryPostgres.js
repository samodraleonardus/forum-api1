const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const CommentOutput = require("../../Domains/comments/entities/CommentOutput");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertComment({ threadId, owner, content }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, owner, content",
      values: [id, threadId, owner, content, date],
    };

    const result = await this._pool.query(query);
    return new CommentOutput(result.rows[0]);
  }

  async validateCommentExistence(commentId, threadId) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }

  async checkCommentOwnership(commentId, owner) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async fetchCommentByThread(threadId) {
    const query = {
      text: `
        SELECT cm.id, us.username, cm.date, cm.content, cm.is_deleted 
        FROM comments cm 
        JOIN users us ON cm.owner = us.id 
        WHERE cm.thread_id = $1 
        ORDER BY cm.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((comment) => ({
      ...comment,
      date: comment.date.toISOString(),
    }));
  }

  async removeCommentById(commentId) {
    const query = {
      text: "UPDATE comments SET is_deleted = TRUE WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;

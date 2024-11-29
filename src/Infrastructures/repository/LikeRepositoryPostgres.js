const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async like(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3, $4)',
      values: [id, commentId, owner, date],
    };

    await this._pool.query(query);
  }

  async unlike(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async validateLikeExistence(commentId, owner) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount > 0;
  }

  async sumLikes() {
    const query = {
      text: 'SELECT comment_id FROM likes',
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = LikeRepositoryPostgres;

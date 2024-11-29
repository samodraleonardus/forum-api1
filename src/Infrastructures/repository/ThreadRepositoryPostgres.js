const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const ThreadOutput = require("../../Domains/threads/entities/ThreadOutput");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertThread({ owner, title, body }) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, owner, title",
      values: [id, owner, title, body, date],
    };

    const result = await this._pool.query(query);
    return new ThreadOutput(result.rows[0]);
  }

  async checkThreadAvailability(threadId) {
    const query = {
      text: "SELECT 1 FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async fetchThreadById(threadId) {
    const query = {
      text: "SELECT th.id, th.title, th.body, th.date, us.username FROM threads th JOIN users us ON th.owner = us.id WHERE th.id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    // orkestrasikannya di use case dengan memanggil fungsi checkThreadAvailability
    // if (!result.rowCount) {
    //   throw new NotFoundError("thread tidak ditemukan");
    // }

    return {
      ...result.rows[0],
      date: result.rows[0].date.toISOString(),
    };
  }
}

module.exports = ThreadRepositoryPostgres;

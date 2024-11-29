/* eslint-disable max-len */
/* eslint-disable comma-dangle */
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadOutput = require("../../../Domains/threads/entities/ThreadOutput");
const ThreadInput = require("../../../Domains/threads/entities/ThreadInput");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "John Doe" });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("insertThread function", () => {
    it("should persist a threadInput and return it correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadInput = new ThreadInput({
        owner: "user-123",
        title: "Sample Thread",
        body: "This is a sample thread body.",
      });

      // Action
      const result = await threadRepository.insertThread(threadInput);

      // Assert
      expect(result).toStrictEqual(
        new ThreadOutput({
          id: "thread-123",
          owner: "user-123",
          title: "Sample Thread",
        }),
      );

      const threads = await ThreadsTableTestHelper.fetchThreadsById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });

  describe("checkThreadAvailability function", () => {
    it("should throw NotFoundError when thread does not exist", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepository.checkThreadAvailability("thread-999"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread exists", async () => {
      await ThreadsTableTestHelper.inputThread({
        id: "thread-123",
        owner: "user-123",
        title: "Existing Thread",
        body: "This is an existing thread.",
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepository.checkThreadAvailability("thread-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("fetchThreadById function", () => {
    it("should return thread details when thread exists", async () => {
      await ThreadsTableTestHelper.inputThread({
        id: "thread-123",
        owner: "user-123",
        title: "Existing Thread",
        body: "This is an existing thread.",
        date: new Date("2024-10-08T04:00:00.000Z").toISOString(),
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepository.fetchThreadById("thread-123");

      // assert untuk semua atribut yang dikembalikan oleh fungsi fetchThreadById
      expect(thread.id).toBe("thread-123");
      expect(thread.username).toBe("John Doe");
      expect(thread.title).toBe("Existing Thread");
      expect(thread.body).toBe("This is an existing thread.");
      expect(thread.date).toBe(new Date("2024-10-08T04:00:00.000Z").toISOString());
    });
  });
});

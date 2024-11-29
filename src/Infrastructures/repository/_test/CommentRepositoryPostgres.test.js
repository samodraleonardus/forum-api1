const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentOutput = require("../../../Domains/comments/entities/CommentOutput");
const CommentInput = require("../../../Domains/comments/entities/CommentInput");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "John Doe" });
    await ThreadsTableTestHelper.inputThread({
      id: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("insertComment function", () => {
    it("should persist a commentInput and return it correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const commentInput = new CommentInput({
        threadId: "thread-123",
        owner: "user-123",
        content: "A new comment",
      });

      // Action
      const result = await commentRepository.insertComment(commentInput);

      // Assert
      expect(result).toStrictEqual(
        new CommentOutput({
          id: "comment-123",
          owner: "user-123",
          content: "A new comment",
        }),
      );

      const comments = await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments).toHaveLength(1);
    });
  });

  describe("validateCommentExistence function", () => {
    it("should throw NotFoundError when comment does not exist", async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.validateCommentExistence("comment-999", "thread-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment exists", async () => {
      await CommentsTableTestHelper.inputComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        content: "A comment",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.validateCommentExistence("comment-123", "thread-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkCommentOwnership function", () => {
    it("should throw AuthorizationError when user is not the owner", async () => {
      await CommentsTableTestHelper.inputComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.checkCommentOwnership("comment-123", "user-456"),
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when user is the owner", async () => {
      await CommentsTableTestHelper.inputComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepository.checkCommentOwnership("comment-123", "user-123"),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("fetchCommentByThread function", () => {
    it("should return comments associated with a specific thread", async () => {
      await CommentsTableTestHelper.inputComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        content: "First comment",
        date: new Date('2024-11-08T10:00:00.000Z').toISOString(),
        is_deleted: false,
      });
      await CommentsTableTestHelper.inputComment({
        id: "comment-124",
        threadId: "thread-123",
        owner: "user-123",
        content: "Second comment",
        date: new Date('2024-11-08T11:00:00.000Z').toISOString(),
        is_deleted: false,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepository.fetchCommentByThread("thread-123");
      expect(comments).toHaveLength(2);

      // assert untuk semua atribut yang dikembalikan oleh fungsi fetchCommentByThread
      expect(comments[0]).toStrictEqual({
        id: "comment-123",
        username: "John Doe",
        content: "First comment",
        date: "2024-11-08T10:00:00.000Z",
        is_deleted: false,
      });
      expect(comments[1]).toStrictEqual({
        id: "comment-124",
        username: "John Doe",
        content: "Second comment",
        date: "2024-11-08T11:00:00.000Z",
        is_deleted: false,
      });
    });
  });

  describe("removeCommentById function", () => {
    it("should mark the comment as deleted", async () => {
      await CommentsTableTestHelper.inputComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        content: "A comment to be deleted",
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await commentRepository.removeCommentById("comment-123");

      const comments = await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments[0].is_deleted).toBe(true);
    });
  });
});

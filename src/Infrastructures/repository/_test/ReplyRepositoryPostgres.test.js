/* eslint-disable comma-dangle */
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ReplyOutput = require("../../../Domains/replies/entities/ReplyOutput");
const ReplyInput = require("../../../Domains/replies/entities/ReplyInput");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "John Doe" });
    await ThreadsTableTestHelper.inputThread({
      id: "thread-123",
      owner: "user-123",
    });
    await CommentsTableTestHelper.inputComment({
      id: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("insertReply function", () => {
    it("should persist a replyInput and return it correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const replyInput = new ReplyInput({
        threadId: "thread-123",
        owner: "user-123",
        commentId: "comment-123",
        content: "A new comment",
      });

      // Action
      const result = await replyRepository.insertReply(replyInput);

      // Assert
      expect(result).toStrictEqual(
        new ReplyOutput({
          id: "reply-123",
          threadId: "thread-123",
          commentId: "comment-123",
          owner: "user-123",
          content: "A new comment",
        }),
      );

      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies).toHaveLength(1);
    });
  });

  describe("fetchReplyByThread function", () => {
    it("should return reply correctly", async () => {
      // Arrange

      await RepliesTableTestHelper.inputReply({
        id: "reply-123",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "First reply",
        date: new Date("2024-11-09T17:00:00.000Z").toISOString(),
        is_deleted: false,
      });
      await RepliesTableTestHelper.inputReply({
        id: "reply-124",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "Second reply",
        date: new Date("2024-11-10T17:00:00.000Z").toISOString(),
        is_deleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const replies = await replyRepositoryPostgres.fetchReplyByThread(
        "thread-123"
      );

      // Assert
      expect(replies).toHaveLength(2);
      // assert semua nilai kembalian
      expect(replies).toStrictEqual([
        {
          id: "reply-123",
          comment_id: "comment-123",
          username: "John Doe",
          content: "First reply",
          date: "2024-11-09T17:00:00.000Z",
          is_deleted: false,
        },
        {
          id: "reply-124",
          comment_id: "comment-123",
          content: "Second reply",
          username: "John Doe",
          date: "2024-11-10T17:00:00.000Z",
          is_deleted: false,
        },
      ]);
    });
  });

  describe("validateReplyExistence function", () => {
    it("should throw NotFoundError when reply does not exist", async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.validateReplyExistence("reply-999"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply exists", async () => {
      await RepliesTableTestHelper.inputReply({
        id: "reply-123",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "A comment",
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepository.validateReplyExistence("reply-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkReplyOwnership function", () => {
    it("should throw AuthorizationError when reply have invalid owner", async () => {
      // Arrange
      const payload = {
        replyId: "reply-123",
        owner: "stranger owner",
      };

      await RepliesTableTestHelper.inputReply({
        id: payload.replyId,
        owner: "user-123",
        threadId: "thread-123",
        commentId: "comment-123",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      // Action and Assert
      await expect(
        replyRepositoryPostgres.checkReplyOwnership(
          payload.replyId,
          payload.owner
        )
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when reply have valid owner", async () => {
      // Arrange
      const payload = {
        replyId: "reply-123",
        owner: "user-123",
      };

      await RepliesTableTestHelper.inputReply({
        id: payload.replyId,
        owner: payload.owner,
        threadId: "thread-123",
        commentId: "comment-123",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      // Action and Assert
      await expect(
        replyRepositoryPostgres.checkReplyOwnership(
          payload.replyId,
          payload.owner
        )
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("removeReplyById function", () => {
    it("should mark the reply as deleted", async () => {
      await RepliesTableTestHelper.inputReply({
        id: "reply-123",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "A comment to be deleted",
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await replyRepository.removeReplyById("reply-123");

      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies[0].is_deleted).toBe(true);
    });
  });
});

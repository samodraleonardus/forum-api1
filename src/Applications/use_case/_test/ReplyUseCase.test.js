const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ReplyInput = require("../../../Domains/replies/entities/ReplyInput");
const ReplyOutput = require("../../../Domains/replies/entities/ReplyOutput");
const ReplyUseCase = require("../ReplyUseCase");

describe("ReplyUseCase", () => {
  describe("create", () => {
    it("should orchestrate the reply creation action correctly", async () => {
      // Arrange
      const useCasePayload = {
        threadId: "thread-123",
        commentId: "comment-123",
        content: "content of the reply",
        owner: "user-123",
      };

      const expectedReplyOutput = new ReplyOutput({
        id: "reply-123",
        content: "content of the reply",
        owner: "user-123",
      });

      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockCommentRepository.validateCommentExistence = jest.fn()
        .mockImplementation(() => Promise.resolve());

      mockReplyRepository.insertReply = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedReplyOutput));

      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const createdReply = await replyUseCase.create(useCasePayload);

      // Assert
      expect(createdReply).toStrictEqual(expectedReplyOutput);
      expect(mockCommentRepository.validateCommentExistence)
        .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
      expect(mockReplyRepository.insertReply)
        .toBeCalledWith(new ReplyInput(useCasePayload));
    });
  });

  describe("remove", () => {
    it("should orchestrate the reply removal action correctly", async () => {
      // Arrange
      const useCasePayload = {
        threadId: "thread-123",
        commentId: "comment-123",
        replyId: "reply-123",
        owner: "user-123",
      };

      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockCommentRepository.validateCommentExistence = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.validateReplyExistence = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.checkReplyOwnership = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.removeReplyById = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      await replyUseCase.remove(useCasePayload);

      // Assert
      expect(mockCommentRepository.validateCommentExistence)
        .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
      expect(mockReplyRepository.validateReplyExistence)
        .toBeCalledWith(useCasePayload.replyId);
      expect(mockReplyRepository.checkReplyOwnership)
        .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
      expect(mockReplyRepository.removeReplyById)
        .toBeCalledWith(useCasePayload.replyId);
    });
  });
});

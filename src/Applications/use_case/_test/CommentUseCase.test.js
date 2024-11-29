const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentOutput = require("../../../Domains/comments/entities/CommentOutput");
const CommentInput = require("../../../Domains/comments/entities/CommentInput");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  describe("create", () => {
    it("should orchestrating the create comment action correctly", async () => {
      // Arrange
      const useCasePayload = {
        owner: "user-123",
        threadId: "thread-123",
        content: "This is a comment",
      };

      const expectedCommentOutput = new CommentOutput({
        id: "comment-123",
        owner: "user-123",
        content: "This is a comment",
      });

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.checkThreadAvailability = jest.fn().mockResolvedValue();

      // mengembalikan CommentOutput,
      mockCommentRepository.insertComment = jest.fn().mockResolvedValue(
        new CommentOutput({
          id: "comment-123",
          owner: "user-123",
          content: "This is a comment",
        }),
      );

      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const result = await commentUseCase.create(useCasePayload);

      // Assert
      expect(result).toStrictEqual(expectedCommentOutput);
      expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(
        useCasePayload.threadId,
      );
      expect(mockCommentRepository.insertComment).toBeCalledWith(
        new CommentInput({
          threadId: useCasePayload.threadId,
          owner: useCasePayload.owner,
          content: useCasePayload.content,
        }),
      );
    });
  });

  describe("remove", () => {
    it("should orchestrating the remove comment action correctly", async () => {
      // Arrange
      const useCasePayload = {
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      };

      const mockCommentRepository = new CommentRepository();

      mockCommentRepository.validateCommentExistence = jest.fn().mockResolvedValue();
      mockCommentRepository.checkCommentOwnership = jest.fn().mockResolvedValue();
      mockCommentRepository.removeCommentById = jest.fn().mockResolvedValue();

      const commentUseCase = new CommentUseCase({
        threadRepository: {},
        commentRepository: mockCommentRepository,
      });

      // Action
      await commentUseCase.remove(useCasePayload);

      // Assert
      expect(mockCommentRepository.validateCommentExistence).toBeCalledWith(
        useCasePayload.commentId,
        useCasePayload.threadId,
      );
      expect(mockCommentRepository.checkCommentOwnership).toBeCalledWith(
        useCasePayload.commentId,
        useCasePayload.owner,
      );
      expect(mockCommentRepository.removeCommentById).toBeCalledWith(
        useCasePayload.commentId,
      );
    });
  });
});

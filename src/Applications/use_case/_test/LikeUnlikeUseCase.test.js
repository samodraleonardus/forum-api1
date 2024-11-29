const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeUnlikeUseCase = require("../LikeUnlikeUseCase");

describe("LikeUnlikeUseCase", () => {
  it("should orchestrating unlike action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.validateCommentExistence = jest.fn(() => Promise.resolve());
    mockLikeRepository.validateLikeExistence = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.unlike = jest.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.validateCommentExistence).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.validateLikeExistence).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.unlike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.unlike).toBeCalledTimes(1);
  });

  it("should orchestrating like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.validateCommentExistence = jest.fn(() => Promise.resolve());
    mockLikeRepository.validateLikeExistence = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.like = jest.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUnlikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.validateCommentExistence).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.validateLikeExistence).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.like).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.like).toBeCalledTimes(1);
  });
});

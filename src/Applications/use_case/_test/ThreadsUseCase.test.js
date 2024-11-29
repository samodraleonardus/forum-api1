const ThreadOutput = require("../../../Domains/threads/entities/ThreadOutput");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadInput = require("../../../Domains/threads/entities/ThreadInput");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository"); // Koreksi: Tambah LikeRepository
const ThreadUseCase = require("../ThreadUseCase");

describe("ThreadUseCase", () => {
  describe("create", () => {
    it("should orchestrate the create thread action correctly", async () => {
      // Arrange
      const useCasePayload = {
        title: "sebuah thread",
        body: "sebuah body thread",
        owner: "user-123",
      };

      const expectedThreadOutput = new ThreadOutput({
        id: "thread-123",
        title: "sebuah thread",
        owner: "user-123",
      });

      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.insertThread = jest.fn().mockResolvedValue(new ThreadOutput({
        id: "thread-123",
        title: "sebuah thread",
        owner: "user-123",
      }));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: {}, // Koreksi: Tambah default dependency kosong
        replyRepository: {},
        likeRepository: {},
      });

      // Action
      const result = await threadUseCase.create(useCasePayload);

      // Assert
      expect(result).toStrictEqual(expectedThreadOutput);
      expect(mockThreadRepository.insertThread).toBeCalledWith(
        new ThreadInput({
          title: "sebuah thread",
          body: "sebuah body thread",
          owner: "user-123",
        }),
      );
    });
  });

  describe("fetchById", () => {
    it("should orchestrate the fetch thread by id action correctly", async () => {
      // Arrange
      const useCasePayload = "thread-123";

      const thread = {
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2024-01-08T07:59:16.198Z",
        username: "dicoding",
      };

      const comments = [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2024-01-08T08:10:18.982Z",
          content: "sebuah comment",
          is_deleted: false,
        },
        {
          id: "comment-456",
          username: "johndoe",
          date: "2024-01-08T08:30:16.982Z",
          content: "**komentar telah dihapus**",
          is_deleted: true,
        },
      ];

      const replies = [
        {
          id: "reply-456",
          comment_id: "comment-123",
          content: "sebuah balasan",
          date: "2024-01-08T08:15:48.766Z",
          username: "johndoe",
          is_deleted: false,
        },
        {
          id: "reply-789",
          comment_id: "comment-123",
          content: "**balasan telah dihapus**",
          date: "2024-01-08T08:20:01.522Z",
          username: "dicoding",
          is_deleted: true,
        },
      ];

      const likes = [
        { comment_id: "comment-123" },
        { comment_id: "comment-123" },
        { comment_id: "comment-456" },
      ]; // Koreksi: Tambah data dummy untuk likes

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      const mockLikeRepository = new LikeRepository(); // Koreksi: Tambah mockLikeRepository

      mockThreadRepository.checkThreadAvailability = jest.fn().mockResolvedValue();
      mockThreadRepository.fetchThreadById = jest.fn().mockResolvedValue(thread);
      mockCommentRepository.fetchCommentByThread = jest.fn().mockResolvedValue(comments);
      mockReplyRepository.fetchReplyByThread = jest.fn().mockResolvedValue(replies);
      mockLikeRepository.sumLikes = jest.fn().mockResolvedValue(likes); // Koreksi: Mock sumLikes

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        likeRepository: mockLikeRepository, // Koreksi: Tambah dependensi
      });

      // Action
      const result = await threadUseCase.fetchById(useCasePayload);

      // Assert
      expect(result).toEqual({
        ...thread,
        comments: [
          {
            id: "comment-123",
            username: "dicoding",
            date: "2024-01-08T08:10:18.982Z",
            replies: [
              {
                id: "reply-456",
                content: "sebuah balasan",
                date: "2024-01-08T08:15:48.766Z",
                username: "johndoe",
              },
              {
                id: "reply-789",
                content: "**balasan telah dihapus**",
                date: "2024-01-08T08:20:01.522Z",
                username: "dicoding",
              },
            ],
            content: "sebuah comment",
            likeCount: 2, // Koreksi: Tambah assert untuk jumlah like
          },
          {
            id: "comment-456",
            username: "johndoe",
            date: "2024-01-08T08:30:16.982Z",
            replies: [],
            content: "**komentar telah dihapus**",
            likeCount: 1, // Koreksi: Tambah assert untuk jumlah like
          },
        ],
      });
      expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(useCasePayload);
      expect(mockThreadRepository.fetchThreadById).toBeCalledWith(useCasePayload);
      expect(mockCommentRepository.fetchCommentByThread).toBeCalledWith(useCasePayload);
      expect(mockReplyRepository.fetchReplyByThread).toBeCalledWith(useCasePayload);
      expect(mockLikeRepository.sumLikes).toBeCalled(); // Koreksi: Tambah assert untuk likes
    });
  });
});

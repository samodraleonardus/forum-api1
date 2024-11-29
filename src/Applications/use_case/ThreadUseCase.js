const ThreadInput = require("../../Domains/threads/entities/ThreadInput");
const ThreadOutput = require("../../Domains/threads/entities/ThreadOutput");

class ThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async create(useCasePayload) {
    const threadInput = new ThreadInput(useCasePayload);
    const createdThread = await this._threadRepository.insertThread(threadInput);
    return new ThreadOutput(createdThread);
  }

  async fetchById(useCasePayload) {
    const threadId = useCasePayload;

    // Memastikan thread tersedia
    await this._threadRepository.checkThreadAvailability(threadId);

    // Mendapatkan detail thread
    const thread = await this._threadRepository.fetchThreadById(threadId);

    // Mendapatkan komentar beserta balasan dan jumlah likes
    const comments = await this._fetchCommentsWithRepliesAndLikes(threadId);

    return { ...thread, comments };
  }

  async _fetchCommentsWithRepliesAndLikes(threadId) {
    const comments = await this._commentRepository.fetchCommentByThread(threadId);
    const replies = await this._replyRepository.fetchReplyByThread(threadId);
    const likes = await this._likeRepository.sumLikes();

    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      replies: this._getRepliesForComment(replies, comment.id),
      content: comment.is_deleted ? "**komentar telah dihapus**" : comment.content,
      likeCount: likes.filter((like) => like.comment_id === comment.id).length,
    }));
  }

  _getRepliesForComment(replies, commentId) {
    return replies
      .filter((reply) => reply.comment_id === commentId)
      .map((reply) => ({
        id: reply.id,
        content: reply.is_deleted ? "**balasan telah dihapus**" : reply.content,
        date: reply.date,
        username: reply.username,
      }));
  }
}

module.exports = ThreadUseCase;

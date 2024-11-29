/* eslint-disable max-len */
const CommentInput = require("../../Domains/comments/entities/CommentInput");
const CommentOutput = require("../../Domains/comments/entities/CommentOutput");

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async create(payload) {
    const commentInput = new CommentInput(payload);
    await this._threadRepository.checkThreadAvailability(commentInput.threadId);
    const createdComment = await this._commentRepository.insertComment(commentInput);
    return new CommentOutput(createdComment);
  }

  async remove(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._commentRepository.validateCommentExistence(commentId, threadId);
    await this._commentRepository.checkCommentOwnership(commentId, owner);
    await this._commentRepository.removeCommentById(commentId);
  }
}

module.exports = CommentUseCase;

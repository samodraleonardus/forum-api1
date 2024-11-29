/* eslint-disable comma-dangle */
/* eslint-disable max-len */
const ReplyInput = require("../../Domains/replies/entities/ReplyInput");
const ReplyOutput = require("../../Domains/replies/entities/ReplyOutput");

class ReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async create(useCasePayload) {
    const replyInput = new ReplyInput(useCasePayload);
    await this._commentRepository.validateCommentExistence(
      replyInput.commentId,
      replyInput.threadId,
    );

    const createdReply = await this._replyRepository.insertReply(replyInput);
    return new ReplyOutput(createdReply);
  }

  async remove(useCasePayload) {
    const {
      threadId, commentId, replyId, owner
    } = useCasePayload;
    await this._commentRepository.validateCommentExistence(commentId, threadId);
    await this._replyRepository.validateReplyExistence(replyId);
    await this._replyRepository.checkReplyOwnership(replyId, owner);
    await this._replyRepository.removeReplyById(replyId);
  }
}

module.exports = ReplyUseCase;

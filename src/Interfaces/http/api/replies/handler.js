const ReplyUseCase = require("../../../../Applications/use_case/ReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.replyCreateHandler = this.replyCreateHandler.bind(this);
    this.replyRemoveHandler = this.replyRemoveHandler.bind(this);
  }

  async replyCreateHandler(request, h) {
    const replyUseCase = this._container.getInstance(
      ReplyUseCase.name,
    );

    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
      content: request.payload.content,
    };

    const replyCreate = await replyUseCase.create(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedReply: replyCreate,
        },
      })
      .code(201);
  }

  async replyRemoveHandler(request, h) {
    const replyUseCase = this._container.getInstance(
      ReplyUseCase.name,
    );

    const useCasePayload = {
      replyId: request.params.replyId,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
    };

    await replyUseCase.remove(useCasePayload);

    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}

module.exports = RepliesHandler;

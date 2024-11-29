const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.commentCreateHandler
      = this.commentCreateHandler.bind(this);
    this.commentRemoveHandler = this.commentRemoveHandler.bind(this);
  }

  async commentCreateHandler(request, h) {
    const useCasePayload = {
      threadId: request.params.threadId,
      owner: request.auth.credentials.id,
      content: request.payload.content,
    };

    const commentUseCase = this._container.getInstance(
      CommentUseCase.name,
    );
    const commentCreate = await commentUseCase.create(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedComment: commentCreate,
        },
      })
      .code(201);
  }

  async commentRemoveHandler(request, h) {
    const useCasePayload = {
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      owner: request.auth.credentials.id,
    };

    const commentUseCase = this._container.getInstance(
      CommentUseCase.name,
    );
    await commentUseCase.remove(useCasePayload);

    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}

module.exports = CommentsHandler;

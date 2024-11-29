/* eslint-disable comma-dangle */
const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.threadCreateHandler = this.threadCreateHandler.bind(this);
    this.threadFetchHandler
      = this.threadFetchHandler.bind(this);
  }

  async threadCreateHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const useCasePayload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const threadCreate = await threadUseCase.create(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedThread: threadCreate,
        },
      })
      .code(201);
  }

  async threadFetchHandler(request, h) {
    const threadUseCase = this._container.getInstance(
      ThreadUseCase.name
    );
    const threadFetch = await threadUseCase.fetchById(
      request.params.threadId
    );

    return h
      .response({
        status: "success",
        data: {
          thread: threadFetch,
        },
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;

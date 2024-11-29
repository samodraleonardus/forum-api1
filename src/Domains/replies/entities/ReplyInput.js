class ReplyInput {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, commentId, owner, content,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    threadId, commentId, owner, content,
  }) {
    if (!threadId || !commentId || !owner || !content) {
      throw new Error("REPLY_INPUT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string"
        || typeof commentId !== "string"
        || typeof owner !== "string"
        || typeof content !== "string"

    ) {
      throw new Error("REPLY_INPUT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ReplyInput;

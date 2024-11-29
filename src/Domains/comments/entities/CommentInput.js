class CommentInput {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, owner, content } = payload;

    this.threadId = threadId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ threadId, owner, content }) {
    if (!threadId || !owner || !content) {
      throw new Error("COMMENT_INPUT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string"
      || typeof owner !== "string"
      || typeof content !== "string"
    ) {
      throw new Error("COMMENT_INPUT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentInput;

class CommentOutput {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, owner, content } = payload;

    this.id = id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ id, owner, content }) {
    if (!id || !owner || !content) {
      throw new Error("COMMENT_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string"
      || typeof owner !== "string"
      || typeof content !== "string"

    ) {
      throw new Error("COMMENT_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentOutput;

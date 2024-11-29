class ReplyOutput {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, owner, content }) {
    if (!id || !owner || !content) {
      throw new Error("REPLY_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string"
      || typeof owner !== "string"
      || typeof content !== "string"

    ) {
      throw new Error("REPLY_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ReplyOutput;

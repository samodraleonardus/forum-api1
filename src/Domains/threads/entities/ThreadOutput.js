class ThreadOutput {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, owner, title } = payload;
    this.id = id;
    this.owner = owner;
    this.title = title;
  }

  _verifyPayload({ id, owner, title }) {
    if (!id || !owner || !title) {
      throw new Error("THREAD_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string"
      || typeof owner !== "string"
      || typeof title !== "string"
    ) {
      throw new Error("THREAD_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ThreadOutput;

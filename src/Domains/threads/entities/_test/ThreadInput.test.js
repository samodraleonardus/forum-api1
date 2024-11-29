const ThreadInput = require("../ThreadInput");

describe("ThreadInput entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      title: "title thread",
    };

    // Action and Assert
    expect(() => new ThreadInput(payload)).toThrowError(
      "THREAD_INPUT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "title thread",
      body: 12345,
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new ThreadInput(payload)).toThrowError(
      "THREAD_INPUT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create ThreadInput entities correctly", () => {
    // Arrange
    const payload = {
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    };

    // Action
    const threadInput = new ThreadInput(payload);

    // Assert
    expect(threadInput).toBeInstanceOf(ThreadInput);
    expect(threadInput.owner).toEqual(payload.owner);
    expect(threadInput.title).toEqual(payload.title);
    expect(threadInput.body).toEqual(payload.body);
  });
});

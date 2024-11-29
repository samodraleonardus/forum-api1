const ThreadOutput = require("../ThreadOutput");

describe("ThreadOutput entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title thread",
    };

    // Action and Assert
    expect(() => new ThreadOutput(payload)).toThrowError(
      "THREAD_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title thread",
      owner: 12345,
    };

    // Action and Assert
    expect(() => new ThreadOutput(payload)).toThrowError(
      "THREAD_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create ThreadOutput entities correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title thread",
      owner: "user-123",
    };

    // Action
    const threadOutput = new ThreadOutput(payload);

    // Assert
    expect(threadOutput).toBeInstanceOf(ThreadOutput);
    expect(threadOutput.id).toEqual(payload.id);
    expect(threadOutput.owner).toEqual(payload.owner);
    expect(threadOutput.title).toEqual(payload.title);
  });
});

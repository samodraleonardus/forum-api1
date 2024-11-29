const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.insertReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(
      replyRepository.validateReplyExistence(""),
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.checkReplyOwnership("", ""),
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.removeReplyById(""),
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.fetchReplyByThread(""),
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});

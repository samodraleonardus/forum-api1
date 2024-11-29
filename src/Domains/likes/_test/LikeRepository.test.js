const LikeRepository = require("../LikeRepository");

describe("a LikeRepository interface", () => {
  it("should throw error when invoking abstract behavior", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.like("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(likeRepository.unlike("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(
      likeRepository.validateLikeExistence("", ""),
    ).rejects.toThrowError("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(likeRepository.sumLikes()).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});

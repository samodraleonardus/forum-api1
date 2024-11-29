class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    // Verifikasi apakah thread tersedia
    await this._threadRepository.checkThreadAvailability(threadId);

    // Verifikasi apakah komentar tersedia di thread tersebut
    await this._commentRepository.validateCommentExistence(commentId, threadId);

    // Periksa apakah like sudah ada
    const isLiked = await this._likeRepository.validateLikeExistence(
      commentId,
      owner,
    );

    if (isLiked) {
      // Jika sudah di-like, lakukan unlike
      await this._likeRepository.unlike(commentId, owner);
    } else {
      // Jika belum di-like, lakukan like
      await this._likeRepository.like(commentId, owner);
    }
  }
}

module.exports = LikeUnlikeUseCase;

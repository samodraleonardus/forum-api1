const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'John Doe' });
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'Jane Doe' });
    await ThreadsTableTestHelper.inputThread({
      id: "thread-123",
      owner: "user-123",
    });
    await CommentsTableTestHelper.inputComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('like function', () => {
    it('should persist a like correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const likeRepository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepository.like('comment-123', 'user-123');

      // Assert
      const likes = await LikesTableTestHelper.findLikeByCommentAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('unlike function', () => {
    it('should remove a like correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const likeRepository = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepository.unlike('comment-123', 'user-123');

      // Assert
      const likes = await LikesTableTestHelper.findLikeByCommentAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('validateLikeExistence function', () => {
    it('should return true when like exists', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const likeRepository = new LikeRepositoryPostgres(pool, {});

      // Action
      const exists = await likeRepository.validateLikeExistence('comment-123', 'user-123');

      // Assert
      expect(exists).toBe(true);
    });

    it('should return false when like does not exist', async () => {
      const likeRepository = new LikeRepositoryPostgres(pool, {});

      const exists = await likeRepository.validateLikeExistence('comment-123', 'user-456');
      expect(exists).toBe(false);
    });
  });

  describe('sumLikes function', () => {
    it('should return all likes', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-124',
        commentId: 'comment-123',
        owner: 'user-456',
      });
      const likeRepository = new LikeRepositoryPostgres(pool, {});

      // Action
      const likes = await likeRepository.sumLikes();

      // Assert
      expect(likes).toHaveLength(2);
    });
  });
});

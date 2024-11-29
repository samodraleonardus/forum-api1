/* eslint-disable comma-dangle */
const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');

describe('/likes endpoint', () => {
  let server;
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if comment does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-999';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({ id: threadId, owner: userId });

      const accessToken = Jwt.token.generate({ id: userId }, accessTokenKey);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 200 and toggle like status', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.inputComment({
        id: commentId,
        threadId,
        owner: userId,
        content: 'A comment',
      });
      const accessToken = Jwt.token.generate({ id: userId }, accessTokenKey);

      // Action: Like the comment
      const responseLike = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert: Like response
      const responseLikeJson = JSON.parse(responseLike.payload);
      expect(responseLike.statusCode).toEqual(200);
      expect(responseLikeJson.status).toEqual('success');

      // Action: Unlike the comment
      const responseUnlike = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert: Unlike response
      const responseUnlikeJson = JSON.parse(responseUnlike.payload);
      expect(responseUnlike.statusCode).toEqual(200);
      expect(responseUnlikeJson.status).toEqual('success');
    });
  });
});

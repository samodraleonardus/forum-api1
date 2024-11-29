/* eslint-disable comma-dangle */
const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');

describe('/comments endpoint', () => {
  let server;
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const payload = {
        content: 'This is a comment',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if payload is invalid', async () => {
      // Arrange
      const payload = {};
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menambahkan comment, properti tidak lengkap'
      );
    });

    it('should response 404 if thread does not exist', async () => {
      // Arrange
      const payload = {
        content: 'This is a comment',
      };
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-999/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 201 and add comment to the thread', async () => {
      // Arrange
      const payload = {
        content: 'This is a comment',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({
        id: threadId,
        owner: userId,
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const commentId = 'comment-123';
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 if user is not the owner of the comment', async () => {
      // Arrange
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: `dicoding-${userId}` });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: `dicoding-${otherUserId}` });
      await ThreadsTableTestHelper.inputThread({
        id: threadId,
        owner: userId,
        title: 'Thread Title',
        body: 'Thread Body',
      });
      await CommentsTableTestHelper.inputComment({
        id: commentId,
        threadId,
        owner: userId,
        content: 'Test Comment',
      });
      const accessToken = Jwt.token.generate(
        { id: otherUserId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Anda tidak berhak mengakses resource ini'
      );
    });

    it('should response 200 and remove comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({
        id: threadId,
        owner: userId,
        title: 'Thread Title',
        body: 'Thread Body',
      });
      await CommentsTableTestHelper.inputComment({
        id: commentId,
        threadId,
        owner: userId,
        content: 'Test Comment',
      });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});

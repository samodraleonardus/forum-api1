/* eslint-disable no-template-curly-in-string */
const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');

describe('/replies endpoint', () => {
  let server;
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const payload = {
        content: 'This is a reply',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
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
        url: '/threads/thread-123/comments/comment-123/replies',
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
        'tidak dapat menambahkan reply, properti tidak lengkap',
      );
    });

    it('should response 404 if comment does not exist', async () => {
      // Arrange
      const payload = {
        content: 'This is a reply',
      };
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({
        id: 'thread-123',
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
        url: '/threads/thread-123/comments/comment-999/replies',
        payload,
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

    it('should response 201 and add reply to the comment', async () => {
      // Arrange
      const payload = {
        content: 'This is a reply',
      };
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
        content: 'This is a comment',
      });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 if user is not the owner of the reply', async () => {
      // Arrange
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
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
      await RepliesTableTestHelper.inputReply({
        id: replyId,
        threadId,
        commentId,
        owner: userId,
        content: 'Test Reply',
      });
      const accessToken = Jwt.token.generate(
        { id: otherUserId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    it('should response 200 and remove reply', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
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
        content: 'This is a comment',
      });
      await RepliesTableTestHelper.inputReply({
        id: replyId,
        threadId,
        commentId,
        owner: userId,
        content: 'This is a reply',
      });
      const accessToken = Jwt.token.generate(
        { id: userId },
        accessTokenKey,
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

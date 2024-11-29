const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');

describe('/threads endpoint', () => {
  let server;
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads', () => {
    it('should response 401 if no authentication is provided', async () => {
      // Arrange
      const payload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it('should response 400 if payload is invalid', async () => {
      // Arrange
      const payload = {
        title: 'Thread Title',
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
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan thread, properti tidak lengkap",
      );
    });

    it('should response 201 and persist thread', async () => {
      // Arrange
      const payload = {
        title: 'Thread Title',
        body: 'Thread Body',
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
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should response 404 if thread not found', async () => {
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 200 and return thread details', async () => {
      // Arrange
      const threadId = 'thread-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.inputThread({
        id: threadId,
        title: 'Thread Title',
        body: 'Thread Body',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(threadId);
    });
  });
});

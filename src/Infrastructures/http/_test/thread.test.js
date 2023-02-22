const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads', () => {
        it('should response 401 if payload not access token', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 if payload not contain needed property', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 if payload not meet data type specification', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 123,
                    body: false,
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 201 and create new thread', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'sebuah body',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual('sebuah thread');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 404 if thread not found', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            const response = await server.inject({
                method: 'GET',
                url: '/threads/123',
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 200 and return detail thread', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const responseAuth = JSON.parse(authentication.payload);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'lorem ipsum dolorr sit amet',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const threadResponse = JSON.parse(thread.payload);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadResponse.data.addedThread.id}`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread.id).toEqual(threadResponse.data.addedThread.id);
            expect(responseJson.data.thread.title).toEqual('sebuah thread');
            expect(responseJson.data.thread.body).toEqual('lorem ipsum dolorr sit amet');
            expect(responseJson.data.thread.username).toEqual('dicoding');
            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
        });
    });
});
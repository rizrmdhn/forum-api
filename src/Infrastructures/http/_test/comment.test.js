const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 401 when request not contain Authorization', async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-1234/comments',
                payload: {},
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload not contain needed property', async () => {
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
                    title: 'Dicoding',
                    body: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseThread = JSON.parse(thread.payload);

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {},
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
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

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Dicoding',
                    body: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseThread = JSON.parse(thread.payload);

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 123,
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
        });

        it('should response 404 if thread id not valid', async () => {
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
                method: 'POST',
                url: '/threads/thread-1234/comments',
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 201 if payload is valid', async () => {
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
                    title: 'Dicoding',
                    body: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseThread = JSON.parse(thread.payload);

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('Komentar berhasil ditambahkan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments', () => {
        it('should response 403 if another user delete the comment', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const loginPayload2 = {
                username: 'dicoding1',
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

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding1',
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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const commentResponse = JSON.parse(comment.payload);

            const authentication2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload2,
            });

            const responseAuth2 = JSON.parse(authentication2.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
                headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak bisa menghapus komentar orang lain');
        });

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
                method: 'DELETE',
                url: '/threads/xxx/comments/xxx',
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 404 if comment not found', async () => {
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
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/xxx`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it('should response 200 and return success', async () => {
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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const commentResponse = JSON.parse(comment.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
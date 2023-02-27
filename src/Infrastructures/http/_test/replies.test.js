const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    let server;

    beforeEach(async () => {
        server = await createServer(container);
    });

    afterEach(async () => {
        await server.stop();
    });

    afterEach(async () => {
        await ReplyTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 if payload not access token', async () => {
            // Arrange
            // const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/123/comments/123/replies',
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

            // const server = await createServer(container);

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
            console.log(responseThread);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {},
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 if payload not meet data type specification', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {
                    content: 123,
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai');
        });

        it('should response 404 if thread not found', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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
                url: '/threads/123/comments/123/replies',
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 404 if comment not found', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/123/replies`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it('should response 201 if payload is valid', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('balasan berhasil ditambahkan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 if request not contain Authorization', async () => {
            // Arrange
            // const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/123/comments/123/replies/123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 403 if user delete the replies', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const loginPayload2 = {
                username: 'dicoding1',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {
                    content: 'sebuah balasan',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const replyResponse = JSON.parse(reply.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
                headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak bisa menghapus balasan orang lain');
        });

        it('should response 404 if reply not found', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/123`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('balasan tidak ditemukan');
        });

        it('should response 200 if reply deleted', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            // const server = await createServer(container);

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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`,
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('balasan berhasil dihapus');
        });
    });
});

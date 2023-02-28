const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikeCommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 401 when request not contain Authorization', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
            });

            // Assert
            expect(response.statusCode).toEqual(401);
        });

        it('should response 201 when request payload contain needed property', async () => {
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

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {
                    content: 'Dicoding Indonesia',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseComment = JSON.parse(comment.payload);

            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
                payload: {
                    commentId: responseComment.data.addedComment.id,
                    threadId: responseThread.data.addedThread.id,
                    userId: responseAuth.data.id,
                    id: 'like-comment-123',
                },
                headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const PostReply = require('../../../Domains/reply/entities/PostReply');
const PostedReply = require('../../../Domains/reply/entities/PostedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await ReplyTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist add reply and return added reply correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });

            const newReply = new PostReply({
                content: 'dicoding',
                owner: 'user-123',
                commentId: 'comment-123',
                threadId: 'thread-123',
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const addedReply = await replyRepositoryPostgres.addReply(newReply);

            const reply = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(addedReply).toStrictEqual(new PostedReply({
                id: 'reply-123',
                content: 'dicoding',
                owner: 'user-123',
            }));
            expect(reply).toHaveLength(1);
        });
    });

    describe('checkAvailabilityReply function', () => {
        it('should throw NotFoundError when reply not available', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when reply not owned by user', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await ReplyTableTestHelper.addReply({ id: 'reply-123', content: 'dicoding', owner: 'user-123', commentId: 'comment-123', threadId: 'thread-123' });

            await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should throw AuthorizationError when reply not owned by user', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await ReplyTableTestHelper.addReply({ id: 'reply-123', content: 'dicoding', owner: 'user-123', commentId: 'comment-123', threadId: 'thread-123' });
            const replyId = 'reply-123';
            const owner = 'user-321';

            await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, owner)).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError when reply owned by user', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await ReplyTableTestHelper.addReply({ id: 'reply-123', content: 'dicoding', owner: 'user-123', commentId: 'comment-123', threadId: 'thread-123' });

            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteReply function', () => {
        it('should delete reply from database', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await ReplyTableTestHelper.addReply({ id: 'reply-123', content: 'dicoding', owner: 'user-123', commentId: 'comment-123', threadId: 'thread-123' });

            await replyRepositoryPostgres.deleteReply('reply-123');

            const reply = await ReplyTableTestHelper.checkIsDeletedReplyById('reply-123');
            expect(reply).toEqual(true);
        });
    });

    describe('getCommentReplies function', () => {
        it('should return replies correctly', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            const userPayload = { id: 'user-123', username: 'dicoding' };
            const threadPayload = {
                id: 'thread-123',
                title: 'dicoding',
                body: 'dicoding',
                owner: 'user-123',
            };
            const commentPayload = {
                id: 'comment-123',
                content: 'dicoding',
                owner: 'user-123',
                threadId: 'thread-123',
            };
            const replyPayload = {
                id: 'reply-123',
                content: 'dicoding',
                owner: 'user-123',
                commentId: 'comment-123',
                threadId: 'thread-123',
            };

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await ReplyTableTestHelper.addReply(replyPayload);

            const replies = await replyRepositoryPostgres.getCommentReplies('comment-123');

            expect(Array.isArray(replies)).toBe(true);
            expect(replies).toHaveLength(1);
        });
    });
});
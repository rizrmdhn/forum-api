const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const PostComment = require('../../../Domains/comment/entities/PostComment');
const PostedComment = require('../../../Domains/comment/entities/PostedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
    it('should be instance of CommentRepository domain', () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await CommentsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('addComment function', () => {
            it('should persist add comment and return added comment correctly', async () => {
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });

                const newComment = new PostComment({
                    content: 'dicoding',
                    owner: 'user-123',
                    threadId: 'thread-123',
                });

                const fakeIdGenerator = () => '123';
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

                const addedComment = await commentRepositoryPostgres.addComment(newComment);

                const comment = await CommentsTableTestHelper.findCommentById('comment-123');
                expect(addedComment).toStrictEqual(new PostedComment({
                    id: 'comment-123',
                    content: 'dicoding',
                    owner: 'user-123',
                }));
                expect(comment).toHaveLength(1);
            });

            describe('checkAvailabilityComment function', () => {
                it('should throw NotFoundError when comment not available', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                    await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123')).rejects.toThrowError(NotFoundError);
                });

                it('should not throw NotFoundError when comment available', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
                    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
                    await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123')).resolves.not.toThrowError(NotFoundError);
                });
            });

            describe('verifyCommentOwner function', () => {
                it('should throw AuthorizationError when comment owner not match', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
                    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
                    const commentId = 'comment-123';
                    const owner = 'user-321';

                    await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, owner)).rejects.toThrowError(AuthorizationError);
                });

                it('should not throw AuthorizationError when comment owner match', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
                    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });

                    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
                });
            });

            describe('deleteComment function', () => {
                it('should delete comment from database', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
                    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
                    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });

                    await commentRepositoryPostgres.deleteComment('comment-123');

                    const comment = await CommentsTableTestHelper.checkIsDeletedCommentsById('comment-123');
                    expect(comment).toEqual(true);
                });
            });

            describe('getCommentsThread function', () => {
                it('should get comments of thread', async () => {
                    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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
                        owner: userPayload.id,
                        threadId: threadPayload.id,
                        date: new Date().toISOString(),
                    };

                    await UsersTableTestHelper.addUser(userPayload);
                    await ThreadsTableTestHelper.addThread(threadPayload);
                    await CommentsTableTestHelper.addComment(commentPayload);

                    const comments = await commentRepositoryPostgres.getCommentsThread(threadPayload.id);

                    expect(comments).toStrictEqual([
                        {
                            id: 'comment-123',
                            content: 'dicoding',
                            is_deleted: false,
                            username: 'dicoding',
                            date: commentPayload.date
                        }
                    ])
                });
            });
        });
    });
});

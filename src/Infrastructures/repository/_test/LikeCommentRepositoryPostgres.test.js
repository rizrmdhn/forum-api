const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentTableTestHelper');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const PostLike = require('../../../Domains/like_comment/entities/PostLike');
const PostedLike = require('../../../Domains/like_comment/entities/PostedLike');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('LikeCommentRepositoryPostgres', () => {
    afterEach(async () => {
        await LikeCommentTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addLikeComment function', () => {
        it('should persist add like comment and return added like comment correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });

            const newLikeComment = new PostLike({
                threadId: 'thread-123',
                commentId: 'comment-123',
                userId: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

            const addedLikeComment = await likeCommentRepositoryPostgres.addLikeComment(newLikeComment);

            const likeComment = await LikeCommentTableTestHelper.findLikeCommentById('like-comment-123');
            expect(addedLikeComment).toStrictEqual(new PostedLike({
                id: 'like-comment-123',
                commentId: 'comment-123',
                userId: 'user-123',
            }));
            expect(likeComment).toHaveLength(1);
        });
    });

    describe('verifyLikeComment function', () => {
        it('should throw AuthorizationError when like comment not owned by user', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await LikeCommentTableTestHelper.addLikeComment({ id: 'like-comment-123', owner: 'user-123', commentId: 'comment-123' });
            const likeCommentId = 'like-comment-123';
            const userId = 'user-321';

            await expect(likeCommentRepositoryPostgres.verifyLikeComment(likeCommentId, userId)).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError when like comment owned by user', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await LikeCommentTableTestHelper.addLikeComment({ id: 'like-comment-123', owner: 'user-123', commentId: 'comment-123' });
            const likeCommentId = 'like-comment-123';
            const userId = 'user-123';

            await expect(likeCommentRepositoryPostgres.verifyLikeComment(likeCommentId, userId)).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteLikeComment function', () => {
        it('should throw NotFoundError when like comment not found', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            const likeCommentId = 'like-comment-123';
            const userId = 'user-123';

            await expect(likeCommentRepositoryPostgres.deleteLikeComment(likeCommentId, userId)).rejects.toThrowError(NotFoundError);
        });

        it('should delete liked comment from database', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await LikeCommentTableTestHelper.addLikeComment({ id: 'like-comment-123', owner: 'user-123', commentId: 'comment-123' });

            await likeCommentRepositoryPostgres.deleteLikeComment('comment-123', 'user-123');

            const likeComment = await LikeCommentTableTestHelper.findLikeCommentById('like-comment-123');
            expect(likeComment).toHaveLength(0);
        });
    });

    describe('getNumberOfLikedComments function', () => {
        it('should return number of liked comments', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await LikeCommentTableTestHelper.addLikeComment({ id: 'like-comment-123', owner: 'user-123', commentId: 'comment-123' });

            const expectedLikeComment = [
                {
                    commentId: 'comment-123',
                    id: 'like-comment-123',
                    threadId: 'thread-123',
                    userId: 'user-123',
                }
            ];

            const numberOfLikedComments = await likeCommentRepositoryPostgres.getNumberOfLikedComments('thread-123');
            expect(numberOfLikedComments).toEqual(expectedLikeComment);
        });
    });

    describe('checkIsLiked function', () => {
        it('should return true when comment is liked', async () => {
            const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'dicoding', body: 'dicoding', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123', threadId: 'thread-123' });
            await LikeCommentTableTestHelper.addLikeComment({ id: 'like-comment-123', owner: 'user-123', commentId: 'comment-123' });

            const isLiked = await likeCommentRepositoryPostgres.checkIsLiked('comment-123', 'user-123');
            expect(isLiked).toEqual(1);
        });
    });
});
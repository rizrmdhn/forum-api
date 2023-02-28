const PostLike = require('../../../Domains/like_comment/entities/PostLike');
const PostedLike = require('../../../Domains/like_comment/entities/PostedLike');
const LikeCommentRepository = require('../../../Domains/like_comment/LikeCommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const AddLikeCommentUseCase = require('../AddLikeCommentUseCase');

describe('AddLikeCommentUseCase', () => {
    it('should orchestrating the add like comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'like-comment-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        }

        const expectedAddedLikeComment = new PostedLike({
            id: 'like-comment-123',
            userId: 'user-123',
            commentId: 'comment-123',
        });

        /** creating dependency of use case */
        const mockLikeCommentRepository = new LikeCommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeCommentRepository.checkIsLiked = jest.fn()
            .mockImplementation(() => Promise.resolve(false));
        mockLikeCommentRepository.addLikeComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedLikeComment));



        /** creating use case instance */
        const addLikeCommentUseCase = new AddLikeCommentUseCase({
            likeCommentRepository: mockLikeCommentRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedLikeComment = await addLikeCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedLikeComment).toStrictEqual(expectedAddedLikeComment);
        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeCommentRepository.checkIsLiked)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockLikeCommentRepository.addLikeComment)
            .toBeCalledWith(new PostLike(useCasePayload));
    });

    it('should orchestrating the delete like comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'like-comment-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        }

        const expectedAddedLikeComment = new PostedLike({
            id: 'like-comment-123',
            userId: 'user-123',
            commentId: 'comment-123',
        });

        /** creating dependency of use case */
        const mockLikeCommentRepository = new LikeCommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeCommentRepository.checkIsLiked = jest.fn()
            .mockImplementation(() => Promise.resolve(true));
        mockLikeCommentRepository.deleteLikeComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedLikeComment));



        /** creating use case instance */
        const addLikeCommentUseCase = new AddLikeCommentUseCase({
            likeCommentRepository: mockLikeCommentRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedLikeComment = await addLikeCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedLikeComment).toStrictEqual(expectedAddedLikeComment);
        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeCommentRepository.checkIsLiked)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockLikeCommentRepository.deleteLikeComment)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });
});
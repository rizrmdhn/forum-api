const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should throw error if use case payload not contain needed property', async () => {
        const useCasePayload = {};
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if payload not meet data type specification', async () => {
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            owner: 123,
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-h_123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment)
            .toBeCalledWith(useCasePayload.commentId);
    });
});
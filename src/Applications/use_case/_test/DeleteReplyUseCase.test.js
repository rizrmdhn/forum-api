const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteCommentUseCase', () => {
    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {};
        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action and Assert
        await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            replyId: 123,
            commentId: 123,
            threadId: 123,
            owner: 123,
        };
        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action and Assert
        await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete reply action correctly', async () => {
        const useCasePayload = {
            replyId: 'reply-123',
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.checkAvailabilityReply = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.checkAvailabilityReply)
            .toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyOwner)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReply)
            .toBeCalledWith(useCasePayload.replyId);
    });
});
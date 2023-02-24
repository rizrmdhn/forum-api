const PostReply = require('../../../Domains/reply/entities/PostReply');
const PostedReply = require('../../../Domains/reply/entities/PostedReply');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'reply content',
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        const expectedAddedReply = new PostedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedReply));
        mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());

        /** creating use case instance */
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new PostReply(useCasePayload));
    });
});
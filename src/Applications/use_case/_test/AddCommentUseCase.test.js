const PostedComment = require('../../../Domains/comment/entities/PostedComment');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const PostComment = require('../../../Domains/comment/entities/PostComment');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'dicoding',
            owner: 'user-123',
        };

        const expectedAddedComment = new PostedComment({
            id: 'comment-123',
            content: 'komentar',
            owner: 'user-123',
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedComment));

        const getCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const postedComment = await getCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
        expect(postedComment).toStrictEqual(expectedAddedComment);
        expect(mockCommentRepository.addComment).toBeCalledWith(new PostComment({
            threadId: useCasePayload.threadId,
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const LikeCommentRepository = require('../../../Domains/like_comment/LikeCommentRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
    it('should orchestrating the detail thread action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-h_123',
        };

        const useCaseThread = {
            id: 'thread-h_123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08 14.00',
            username: 'dicoding',
        };

        const useCaseComment = [
            {
                id: 'comment-123',
                username: 'dicoding',
                date: '2021-08-08 14.00',
                content: 'sebuah comment',
                is_deleted: false,
            },
            {
                id: 'comment-123',
                username: 'dicoding',
                date: '2021-08-08 14.00',
                content: 'sebuah comment',
                is_deleted: true,
            },
        ];

        const useCaseReply = [
            {
                id: 'reply-123',
                username: 'dicoding',
                date: '2021-08-08 14.00',
                content: 'sebuah reply',
                commentId: 'comment-123',
                is_deleted: false,
            },
            {
                id: 'reply-123',
                username: 'dicoding',
                date: '2021-08-08 14.00',
                content: 'sebuah reply',
                commentId: 'comment-123',
                is_deleted: true,
            },
        ];

        const useCaseLikeComment = [
            {
                id: 'like-comment-123',
                commentId: 'comment-123',
                threadId: 'thread-h_123',
                userId: 'user-123',
            },
            {
                id: 'like-comment-123',
                commentId: 'comment-123',
                threadId: 'thread-h_123',
                userId: 'user-321',
            },
        ];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockLikeCommentRepository = new LikeCommentRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseThread));
        mockCommentRepository.getCommentsThread = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseComment));
        mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseReply));
        mockLikeCommentRepository.getNumberOfLikedComments = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseLikeComment));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeCommentRepository: mockLikeCommentRepository,
        });

        const detailThread = await detailThreadUseCase.execute(useCasePayload);

        const expectedThread = await mockThreadRepository.getDetailThread(useCasePayload.threadId);

        expect(mockThreadRepository.getDetailThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.getCommentsThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockReplyRepository.getCommentRepliesByThreadId)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockLikeCommentRepository.getNumberOfLikedComments)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(detailThread).toStrictEqual({ thread: expectedThread });
    });
});
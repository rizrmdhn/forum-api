const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
    it('should orchestrating the detail thread action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-h_123',
        };

        const expectedThread = {
            id: 'thread-h_123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08 14.00',
            username: 'dicoding',
        };

        const expectedComment = [
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

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread));
        mockCommentRepository.getCommentsThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComment));
        mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([]));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        const detailThread = await detailThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.getDetailThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.getCommentsThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(detailThread).toStrictEqual({
            thread: {
                id: 'thread-h_123',
                title: 'sebuah thread',
                body: 'sebuah body thread',
                date: '2021-08-08 14.00',
                username: 'dicoding',
                comments: [
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        date: '2021-08-08 14.00',
                        replies: [],
                        content: 'sebuah comment',
                    },
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        date: '2021-08-08 14.00',
                        replies: [],
                        content: '**komentar telah dihapus**',
                    },
                ],
            },
        });
    });
});
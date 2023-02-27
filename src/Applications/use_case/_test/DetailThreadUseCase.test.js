const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
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

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseThread));
        mockCommentRepository.getCommentsThread = jest.fn()
            .mockImplementation(() => Promise.resolve(useCaseComment));
        mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([]));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });


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
                replies: [],
            },
            {
                id: 'comment-123',
                username: 'dicoding',
                date: '2021-08-08 14.00',
                content: "**komentar telah dihapus**",
                replies: [],
            },
        ];

        const detailThread = await detailThreadUseCase.execute(useCasePayload);

        expect(mockThreadRepository.getDetailThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.getCommentsThread)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockReplyRepository.getCommentRepliesByThreadId)
            .toHaveBeenCalledWith(useCasePayload.threadId);
        expect(detailThread.thread.id).toEqual(expectedThread.id);
        expect(detailThread.thread.title).toEqual(expectedThread.title);
        expect(detailThread.thread.body).toEqual(expectedThread.body);
        expect(detailThread.thread.date).toEqual(expectedThread.date);
        expect(detailThread.thread.username).toEqual(expectedThread.username);
        expect(detailThread.thread.comments).toEqual(expectedComment);
    });
});
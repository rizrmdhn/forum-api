const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            threadId: 'thread-h_123',
            owner: 'user-123',
        };

        expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
            threadId: 'thread-h_123',
            owner: 'user-123',
        };

        expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostComment object correctly', () => {
        const payload = {
            content: 'dicoding',
            threadId: 'thread-h_123',
            owner: 'user-123',
        };

        const { content, threadId, owner } = new PostComment(payload);

        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(owner).toEqual(payload.owner);
    });
});
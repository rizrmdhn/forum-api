const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'dicoding',
            owner: 'user-123',
        };

        expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 'dicoding',
            threadId: 'thread-h_123',
            owner: 'user-123',
        };

        expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostedComment object correctly', () => {
        const payload = {
            id: 'comment-123',
            content: 'dicoding',
            threadId: 'thread-h_123',
            owner: 'user-123',
        };

        const { id, content, threadId, owner } = new PostedComment(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(owner).toEqual(payload.owner);
    });
});
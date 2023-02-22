const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'reply content',
        };
        // Action and Assert
        expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
            owner: 123,
            commentId: 123,
            threadId: 123,
        };
        // Action and Assert
        expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostReply object correctly', () => {
        // Arrange
        const payload = {
            content: 'reply content',
            owner: 'user-123',
            commentId: 'comment-123',
            threadId: 'thread-123',
        };

        // Action
        const { content, owner, commentId, threadId } = new PostReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
        expect(commentId).toEqual(payload.commentId);
        expect(threadId).toEqual(payload.threadId);
    });
});
const PostLike = require('../PostLike');

describe('a PostLike entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        };

        // Action and Assert
        expect(() => new PostLike(payload)).toThrowError('POST_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: 123,
            threadId: 123,
            userId: 123,
        };

        // Action and Assert
        expect(() => new PostLike(payload)).toThrowError('POST_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostLike object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            userId: 'user-123',
        };

        // Action
        const { commentId, threadId ,userId } = new PostLike(payload);

        // Assert
        expect(commentId).toEqual(payload.commentId);
        expect(threadId).toEqual(payload.threadId);
        expect(userId).toEqual(payload.userId);
    });
});
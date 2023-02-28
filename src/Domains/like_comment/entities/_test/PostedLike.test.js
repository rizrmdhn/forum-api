const PostedLike = require('../PostedLike');

describe('a PostedLike entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        };

        // Action and Assert
        expect(() => new PostedLike(payload)).toThrowError('POSTED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'like-comment-123',
            userId: 123,
            commentId: 123,
        };

        // Action and Assert
        expect(() => new PostedLike(payload)).toThrowError('POSTED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostedLike object correctly', () => {
        // Arrange
        const payload = {
            id: 'like-comment-123',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        // Action
        const { likeCount } = new PostedLike(payload);

        // Assert
        expect(likeCount).toEqual(payload.likeCount);
    });
});
const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            body: 'ini adalah body',
        };

        // Action and Assert
        expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 'sebuah thread',
            owner: 123,
        };

        // Action and Assert
        expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create PostedThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread',
            owner: 'user-123',
        };

        // Action
        const postedThread = new PostedThread(payload);

        // Assert
        expect(postedThread).toBeInstanceOf(PostedThread);
        expect(postedThread.id).toEqual(payload.id);
        expect(postedThread.title).toEqual(payload.title);
        expect(postedThread.owner).toEqual(payload.owner);
    });
});
const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            body: 'ini adalah body',
        }

        // Action and Assert
        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            body: 'ini adalah body',
            ownerId: 123,
        };

        // Action and Assert
        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when title more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread yang sangat panjang dan tidak akan pernah berakhir',
            body: 'ini adalah body',
            ownerId: 'user-123',
        };

        // Action and Assert
        expect(() => new PostThread(payload)).toThrowError('POST_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create PostThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'sebuah thread',
            body: 'ini adalah body',
            ownerId: 'user-123',
        };

        // Action
        const postThread = new PostThread(payload);

        // Assert
        expect(postThread).toBeInstanceOf(PostThread);
        expect(postThread.title).toEqual(payload.title);
        expect(postThread.body).toEqual(payload.body);
        expect(postThread.ownerId).toEqual(payload.ownerId);
    });
});
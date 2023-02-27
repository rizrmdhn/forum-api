const DetailedReply = require('../DetailedReply');

describe('a DetailedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
        };

        expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 123,
            date: 123,
            username: 123,
            is_deleted: 123,
            commentId: 123,
        };

        expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should remap deleted property correctly', () => {
        const payload = {
            id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
            content: 'balasan yang lain tapi udah dihapus',
            date: '2021-08-08T07:26:21.338Z',
            username: 'dicoding',
            is_deleted: true,
            commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        };

        const reply = new DetailedReply(payload);

        const expectedReply = {
            id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T07:26:21.338Z',
            username: 'dicoding',
        };

        expect(reply).toEqual(expectedReply);
    });

    it('should create DetailedReply object correctly', () => {
        const payload = {
            id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
            content: 'sebuah balasan',
            date: '2021-08-08T07:26:21.338Z',
            username: 'dicoding',
            is_deleted: false,
            commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        };

        const reply = new DetailedReply(payload);

        const expectedReply = {
            id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
            content: 'sebuah balasan',
            date: '2021-08-08T07:26:21.338Z',
            username: 'dicoding',
        };

        expect(reply).toEqual(expectedReply);
    });
});
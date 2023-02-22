const DetailedReply = require('../DetailedReply');

describe('a DetailedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
        };

        expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            reply: {},
        };

        expect(() => new DetailedReply(payload)).toThrowError('DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should remap deleted property correctly', () => {
        const payload = {
            reply: [
                {
                    id: 'reply-0X4Y4Y4Y4Y4Y4Y4Y4Y4Y',
                    content: 'sebuah balasan',
                    date: '2021-08-08T07:22:33.555Z',
                    username: 'johndoe',
                    is_deleted: false,
                },
                {
                    id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
                    content: 'balasan yang lain tapi udah dihapus',
                    date: '2021-08-08T07:26:21.338Z',
                    username: 'dicoding',
                    is_deleted: true,
                },
            ],
        };

        const { reply } = new DetailedReply(payload);

        const expectedReply = [
            {
                id: 'reply-0X4Y4Y4Y4Y4Y4Y4Y4Y4Y',
                content: 'sebuah balasan',
                date: '2021-08-08T07:22:33.555Z',
                username: 'johndoe',
            },
            {
                id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:26:21.338Z',
                username: 'dicoding',
            },
        ];

        expect(reply).toEqual(expectedReply);
    });

    it('should create DetailedReply object correctly', () => {
        const payload = {
            reply: [
                {
                    id: 'reply-0X4Y4Y4Y4Y4Y4Y4Y4Y',
                    content: 'sebuah balasan',
                    date: '2021-08-08T07:22:33.555Z',
                    username: 'johndoe',
                },
                {
                    id: 'reply-1X4Y4Y4Y4Y4Y4Y4Y4Y',
                    content: '**balasan telah dihapus**',
                    date: '2021-08-08T07:26:21.338Z',
                    username: 'dicoding',
                },
            ],
        };

        const { reply } = new DetailedReply(payload);

        expect(reply).toEqual(payload.reply);
    });
});
const DetailedComment = require('../DetailedComment');

describe('a DetailedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
        };

        expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 123,
            date: 123,
            username: 123,
            is_deleted: 123,
        };

        expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should remap deleted property correctly', () => {
        const payload = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            is_deleted: true,
        };

        const comment = new DetailedComment(payload);

        const expectedComment = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: '**komentar telah dihapus**',
        }

        expect(comment).toEqual(expectedComment);
    });

    it('should create DetailedComment object correctly', () => {
        const payload = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            is_deleted: false,
        };

        const comment = new DetailedComment(payload);

        const expectedComment = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
        }

        expect(comment).toEqual(expectedComment);
    });
});
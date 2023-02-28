class LikedComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const likeCount = payload;

        this.likeCount = likeCount;
    }

    _verifyPayload(payload) {
        const likeCount = payload;

        if (!likeCount) {
            throw new Error('LIKED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof likeCount !== 'number') {
            throw new Error('LIKED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = LikedComment;
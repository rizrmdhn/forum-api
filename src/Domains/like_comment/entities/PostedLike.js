class PostedLike {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, userId, commentId } = payload;

        this.id = id;
        this.userId = userId;
        this.commentId = commentId;
    }

    _verifyPayload(payload) {
        const { id, userId, commentId } = payload;

        if (!id || !userId || !commentId) {
            throw new Error('POSTED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string') {
            throw new Error('POSTED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = PostedLike;
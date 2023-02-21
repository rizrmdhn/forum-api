class PostThread {
    constructor(payload) {
        this._verifyPayload(payload);

        const { title, body, ownerId } = payload;

        this.title = title;
        this.body = body;
        this.ownerId = ownerId;
    }

    _verifyPayload(payload) {
        const { title, body, ownerId } = payload;

        if (!title || !body || !ownerId) {
            throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string' || typeof ownerId !== 'string') {
            throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (title.length > 50) {
            throw new Error('POST_THREAD.TITLE_LIMIT_CHAR');
        }
    }
}

module.exports = PostThread;
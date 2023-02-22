class PostedComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, threadId, owner } = payload;
        this.id = id;
        this.content = content;
        this.threadId = threadId;
        this.owner = owner;
    }

    _verifyPayload(payload) {
        const { id, content, owner } = payload;
        if (!id || !content || !owner) {
            throw new Error('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
            throw new Error('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = PostedComment;
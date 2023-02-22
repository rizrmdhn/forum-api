class DetailedReply {
    constructor(payload) {
        this._verifyPayload(payload);
        const replies = this._remapDeletedProperty(payload);
        this.reply = replies;
    }

    _verifyPayload(payload) {
        const { reply } = payload;

        if (!reply) {
            throw new Error('DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (!Array.isArray(reply)) {
            throw new Error('DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    _remapDeletedProperty(payload) {
        const { reply } = payload;
        return reply.map((replies) => ({
            id: replies.id,
            content: replies.is_deleted ? '**balasan telah dihapus**' : replies.content,
            username: replies.username,
            date: replies.date,
        }));

    }
}

module.exports = DetailedReply;
class DetailedReply {
    constructor(payload) {
        this._verifyPayload(payload);
        const { id, content, date, username, is_deleted } = payload;
        this.id = id;
        this.date = date;
        this.username = username;
        this.content = is_deleted ? '**balasan telah dihapus**' : content;
    }

    _verifyPayload(payload) {
        const { id, content, date, username, commentId } = payload;

        if (!id || !content || !date || !username || !commentId) {
            throw new Error('DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof commentId !== 'string') {
            throw new Error('DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailedReply;
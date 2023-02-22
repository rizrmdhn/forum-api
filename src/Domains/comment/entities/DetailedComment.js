class DetailedComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const comments = this._remapDeletedProperty(payload);
        this.comment = comments;
    }

    _verifyPayload(payload) {
        const { comment } = payload;

        if (!comment) {
            throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (!Array.isArray(comment)) {
            throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    _remapDeletedProperty(payload) {
        const { comment } = payload;
        return comment.map((comments) => ({
            id: comments.id,
            content: comments.is_deleted ? '**komentar telah dihapus**' : comments.content,
            username: comments.username,
            date: comments.date,
        }));

    }
}

module.exports = DetailedComment;
const PostReply = require('../../Domains/reply/entities/PostReply');

class AddReplyUseCase {
    constructor({ replyRepository, threadRepository, commentRepository }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const postReply = new PostReply(useCasePayload);
        await this._threadRepository.checkAvailabilityThread(postReply.threadId);
        await this._commentRepository.checkAvailabilityComment(postReply.commentId);
        return this._replyRepository.addReply(postReply);
    }
}

module.exports = AddReplyUseCase;
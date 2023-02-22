const PostComment = require('../../Domains/comment/entities/PostComment');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(threadId);
        const newComment = new PostComment(useCasePayload);
        return this._commentRepository.addComment(newComment);
    }
}

module.exports = AddCommentUseCase;
const PostLike = require('../../Domains/like_comment/entities/PostLike');

class AddLikeCommentUseCase {
    constructor({ likeCommentRepository, threadRepository, commentRepository }) {
        this._likeCommentRepository = likeCommentRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const postLike = new PostLike(useCasePayload);
        await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
        await this._commentRepository.checkAvailabilityComment(useCasePayload.commentId);
        const isLiked = await this._likeCommentRepository.checkIsLiked(useCasePayload.commentId, useCasePayload.userId);

        if (!isLiked) {
            return await this._likeCommentRepository.addLikeComment(postLike);
        }

        return this._likeCommentRepository.deleteLikeComment(useCasePayload.commentId, useCasePayload.userId);
    }
}

module.exports = AddLikeCommentUseCase;
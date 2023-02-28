class LikeCommentRepository {
    async addLikeComment(userId, commentId) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikeComment(id) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteLikeComment(commentId, userId) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
    async getNumberOfLikedComments(threadId) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async checkIsLiked(commentId, userId) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeCommentRepository;
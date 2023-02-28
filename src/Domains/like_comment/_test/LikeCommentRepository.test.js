const LikeCommentRepository = require('../LikeCommentRepository');

describe('a LikeCommentRepository interfaces', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const likeCommentRepository = new LikeCommentRepository();

        // Action and Assert
        await expect(likeCommentRepository.addLikeComment('', '', '')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.getLikeComment('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.deleteLikeComment('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.getNumberOfLikedComments('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.checkIsLiked('', '')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
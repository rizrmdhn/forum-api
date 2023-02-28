const DetailThread = require('../../Domains/thread/entities/DetailThread');
const DetailedComment = require('../../Domains/comment/entities/DetailedComment');
const DetailedReply = require('../../Domains/reply/entities/DetailedReply');

class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository, likeCommentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeCommentRepository = likeCommentRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = new DetailThread(useCasePayload);
        await this._threadRepository.checkAvailabilityThread(threadId);
        const detailThread = await this._threadRepository.getDetailThread(threadId);
        const getCommentsThread = await this._commentRepository.getCommentsThread(threadId);
        const getRepliesComment = await this._replyRepository.getCommentRepliesByThreadId(threadId);
        const getLikesComment = await this._likeCommentRepository.getNumberOfLikedComments(threadId);


        detailThread.comments = getCommentsThread.map((comment) => {
            comment.likeCount = getLikesComment.filter((filtered) => filtered.commentId === comment.id).length;
            comment.replies = getRepliesComment.filter((filtered) => filtered.commentId === comment.id).map((reply) => new DetailedReply(reply));
            return new DetailedComment(comment);
        });


        return {
            thread: detailThread,
        };
    }
}

module.exports = DetailThreadUseCase;
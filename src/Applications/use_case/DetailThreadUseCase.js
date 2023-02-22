const DetailThread = require('../../Domains/thread/entities/DetailThread');
const DetailedComment = require('../../Domains/comment/entities/DetailedComment');

class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = new DetailThread(useCasePayload);
        await this._threadRepository.checkAvailabilityThread(threadId);
        const detailThread = await this._threadRepository.getDetailThread(threadId);
        const getCommentsThread = await this._commentRepository.getCommentsThread(threadId);
        detailThread.comments = new DetailedComment({ comment: getCommentsThread }).comment;
        return {
            thread: detailThread,
        };
    }
}

module.exports = DetailThreadUseCase;
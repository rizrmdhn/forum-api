const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase');

class LikeCommentHandler {
    constructor(container) {
        this._container = container;

        this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
    }

    async putLikeCommentHandler(request, h) {
        const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);
        const { threadId, commentId } = request.params;
        const { id: userId } = request.auth.credentials;

        const payload = {
            threadId,
            commentId,
            userId,
        };

        await addLikeCommentUseCase.execute(payload);

        return {
            status: 'success',
        }
    }
}


module.exports = LikeCommentHandler;
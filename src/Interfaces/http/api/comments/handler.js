const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const { id: owner } = request.auth.credentials;
        const { threadId } = request.params;
        const useCasePayload = {
            content: request.payload.content,
            threadId,
            owner,
        };
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        const response = h.response({
            status: 'success',
            message: 'Komentar berhasil ditambahkan',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const useCasePayload = {
            threadId,
            commentId,
            owner,
        };
        await deleteCommentUseCase.execute(useCasePayload);

        return {
            status: 'success',
            message: 'Komentar berhasil dihapus',
        };
    }
}

module.exports = CommentHandler;
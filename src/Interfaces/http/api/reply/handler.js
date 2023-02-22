const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const { id: credentialId } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const useCasePayload = {
            content: request.payload.content,
            threadId,
            commentId,
            owner: credentialId,
        };
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        const response = h.response({
            status: 'success',
            message: 'balasan berhasil ditambahkan',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request) {
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        const { id: credentialId } = request.auth.credentials;
        const { threadId, commentId, replyId } = request.params;
        const useCasePayload = {
            threadId,
            commentId,
            replyId,
            owner: credentialId,
        };
        await deleteReplyUseCase.execute(useCasePayload);

        return {
            status: 'success',
            message: 'balasan berhasil dihapus',
        };
    }
}

module.exports = ReplyHandler;
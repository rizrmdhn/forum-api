const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const { id: credentialId } = request.auth.credentials;
        const useCasePayload = {
            ...request.payload,
            ownerId: credentialId,
        };
        const addedThread = await addThreadUseCase.execute(useCasePayload);
        const response = h.response({
            status: 'success',
            message: 'Thread berhasil ditambahkan',
            data: {
                addedThread,
            },
        })
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;
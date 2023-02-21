class AuthenticationRepository {
    async addToken() {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyRefreshToken() {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteRefreshToken() {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = AuthenticationRepository;
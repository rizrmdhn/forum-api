const AuthenticationRepository = require('../AuthenticationRepository');

describe('a AuthenticationRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const authenticationRepository = new AuthenticationRepository();

        // Action and Assert

        await expect(authenticationRepository.addToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationRepository.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationRepository.deleteRefreshToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
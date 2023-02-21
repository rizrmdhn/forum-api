const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentications = require('../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
    constructor({
        userRepository,
        authenticationRepository,
        authenticationTokenManager,
        passwordHash,
    }) {
        this._userRepository = userRepository;
        this._authenticationRepository = authenticationRepository;
        this._authenticationTokenManager = authenticationTokenManager;
        this._passwordHash = passwordHash;
    }

    async execute(useCasePayload) {
        const { username, password } = new UserLogin(useCasePayload);

        const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

        await this._passwordHash.compare(password, encryptedPassword);

        const accessToken = await this._authenticationTokenManager.createAccessToken({ username });
        const refreshToken = await this._authenticationTokenManager.createRefreshToken({ username });

        const newAuthentication = new NewAuthentications({
            accessToken,
            refreshToken,
        });

        await this._authenticationRepository.addToken(refreshToken);

        return newAuthentication;
    }
}

module.exports = LoginUserUseCase;
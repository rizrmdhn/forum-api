const PostThread = require('../../../Domains/thread/entities/PostThread');
const PostedThread = require('../../../Domains/thread/entities/PostedThread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'sebuah thread',
            body: 'ini adalah body',
            ownerId: 'user-123',
        };

        const expectedPostedThread = new PostedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.ownerId,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedPostedThread));

        /** creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const postedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(postedThread).toStrictEqual(expectedPostedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new PostThread(useCasePayload));
    });
});
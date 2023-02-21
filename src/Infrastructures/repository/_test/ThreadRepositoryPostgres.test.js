const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const PostThread = require('../../../Domains/thread/entities/PostThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostedThread = require('../../../Domains/thread/entities/PostedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    it('should be instance of ThreadRepository domain', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // Dummy dependency

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await ThreadsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('addThread function', () => {
            it('should persist add thread and return posted thread correctly', async () => {
                // Arrange
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

                const newThread = new PostThread({
                    title: 'sebuah thread',
                    body: 'ini adalah body',
                    ownerId: 'user-123',
                });

                const fakeIdGenerator = () => '123'; // stub!
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

                // Action
                const postedThread = await threadRepositoryPostgres.addThread(newThread);

                // Assert
                const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

                expect(threads).toHaveLength(1);
                expect(postedThread).toStrictEqual(new PostedThread({
                    id: 'thread-123',
                    title: 'sebuah thread',
                    owner: 'user-123',
                }));
                expect(threads).toHaveLength(1);
            });
        });


        describe('checkAvailabilityThread function', () => {
            it('should throw NotFoundError if thread not available', async () => {
                // Arrange
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
                const threadId = 'xxx';

                // Action & Assert
                await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
                    .rejects.toThrow(NotFoundError);
            });

            it('should not throw NotFoundError if thread available', async () => {
                // Arrange
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
                await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', ownerId: 'user-123' });

                // Action & Assert
                await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123'))
                    .resolves.not.toThrow(NotFoundError);
            });
        });
    });
});
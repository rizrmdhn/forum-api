const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};


DomainErrorTranslator._directories = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan thread baru karena properti yang dibutuhkan tidak ada'),
    'POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
    'POST_THREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
    'POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
    'POSTED_THREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
    'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
    'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
    'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
    'POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada'),
    'POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai'),
    'POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada'),
    'POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai'),
    'DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada'),
    'DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai'),
    'POST_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan like karena properti yang dibutuhkan tidak ada'),
    'POST_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan like karena tipe data tidak sesuai'),
    'POSTED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan like karena properti yang dibutuhkan tidak ada'),
    'POSTED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan like karena tipe data tidak sesuai'),
};


module.exports = DomainErrorTranslator;
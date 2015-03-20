'use strict';
module.exports = {};

var errors = [
    'ForbiddenError',
    'AccessTokenExpiredError',
    'AccessTokenInvalidError',
    'InvalidClientError',
    'InvalidGrantError',
    'NotFoundError'
];

errors.forEach(function (error) {
    module.exports[error] = function () {
        Error.apply(this, arguments);
    };
    module.exports[error].prototype = new Error();
});
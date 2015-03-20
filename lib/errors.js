'use strict';
module.exports = {};

var errors = [
    'ForbiddenError',
    'AccessTokenExpiredError',
    'InvalidAccessTokenError',
    'InvalidClientError',
    'InvalidGrantError'
];

errors.forEach(function (error) {
    module.exports[error] = function () {
        Error.apply(this, arguments);
    };
    module.exports[error].prototype = new Error();
});
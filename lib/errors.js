'use strict';
module.exports = {};

var errors = ['ForbiddenError','AccessTokenExpiredError','InvalidClientError'];

while (error = errors.pop()) {
	module.exports[error] = function () {};
	module.exports[error].prototype = new Error();
}


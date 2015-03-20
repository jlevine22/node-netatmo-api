'use strict';
var _ = require('lodash');
var request = require('request');
var util = require('util');
var events = require('events');
var errors = require('./errors');
var Promise = require('bluebird');

var NETATMO_BASE_URL = 'https://api.netatmo.net';

/**
 * @param options {object}
 * @param options.clientId {string} The Netatmo API Application Client id
 * @param options.clientSecret {string} The Netatmo API Application Client secret
 * @constructor
 */
function NetatmoClient(options) {
    this.options = _.defaults(options || {}, {});

    if (this.options.clientId === undefined || this.options.clientSecret === undefined) {
        throw new Error('clientId and clientSecret are both required to instantiate the NetatmoClient');
    }
}

/**
 * A function to be used for returning a promise or executing a callback when returning
 * the result of a function
 * @param callback {Function} Standard callback function that takes an error as the first
 *                            argument and the result of the method as the second
 * @param promise {Promise}
 * @returns {Promise}
 */
NetatmoClient.callbackOrPromise = function callbackOrPromise(callback, promise) {
    if (typeof callback === 'function') {
        promise.then(function (result) {
            callback(null, result);
        }).catch(function (error) {
            callback(error);
        });
        return;
    }
    return promise;
};

var callbackOrPromise = NetatmoClient.callbackOrPromise;

/**
 *
 * @param path {string} Path for the API call (/some/path). MUST include leading backslash (/)
 * @param parameters {object}
 * @param method {string} Optional. Defaults to 'GET'.
 * @returns {bluebird}
 */
NetatmoClient.prototype.request = function netatmoApiRequest(path, parameters, method) {
    if (path === undefined) {
        throw new Error('Path is required');
    }

    return new Promise(function (resolve, reject) {
        var options = {
            method: method || 'GET',
            uri: NETATMO_BASE_URL + path
        };

        if (options.method === 'GET') {
            options.qs = parameters;
        } else if (options.method === 'POST') {
            options.form = parameters;
        }

        request(options, function (error, response, body) {
            if (error) {
                return reject(error);
            }

            var jsonBody;
            try {
                jsonBody = JSON.parse(body);
                if (!jsonBody) {
                    return reject('Invalid JSON Body');
                }
            } catch (jsonParseError) {
                reject(jsonParseError);
            }

            switch (response.statusCode) {
            case 200:
                return resolve(jsonBody);
            case 400:
                if (jsonBody.error === 'invalid_client') {
                    return reject(new (errors.InvalidClientError)("Invalid Client"));
                }
                if (jsonBody.error === 'invalid_grant') {
                    return reject(new (errors.InvalidGrantError)("Invalid Grant"));
                }
                return reject(new Error("Unknown HTTP 400 error: " + body));
            case 403:
                if (!jsonBody.error) {
                    return reject(new errors.ForbiddenError('Got 403 forbidden error from server'));
                }
                if (jsonBody.error.code === 3) {
                    return reject(new (errors.AccessTokenExpiredError)(jsonBody.error.message));
                }
                if (jsonBody.error.code === 2) {
                    return reject(new (errors.AccessTokenInvalidError)(jsonBody.error.message));
                }
                return reject(new (errors.ForbiddenError)(body));
            case 404:
                return reject(new (errors.NotFoundError)(jsonBody.error.message));
            default:
                return reject(new Error('Invalid Server Response: [' + response.statusCode + '] ' + response.body));
            }
        });
    });
};

NetatmoClient.prototype.getToken = function getToken(options, cb) {
    options = _.defaults(options || {}, {
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        scope: 'read_station read_thermostat write_thermostat'
    });
    return callbackOrPromise(cb, this.request('/oauth2/token', options, 'POST'));
};

NetatmoClient.prototype.getUser = function getUser(options, cb) {
    return callbackOrPromise(cb, this.request('/api/getuser', options));
};

NetatmoClient.prototype.deviceList = function deviceList(options, cb) {
    return callbackOrPromise(cb, this.request('/api/devicelist', options));
};

NetatmoClient.prototype.getMeasure = function getMeasure(options, cb) {
    return callbackOrPromise(cb, this.request('/api/getmeasure', options));
};

NetatmoClient.prototype.getThermState = function getThermState(options, cb) {
    return callbackOrPromise(cb, this.request('/api/getthermstate', options));
};

NetatmoClient.prototype.syncSchedule = function syncSchedule(options, cb) {
    return callbackOrPromise(cb, this.request('/api/syncschedule', options, 'POST'));
};

NetatmoClient.prototype.setThermPoint = function setThermPoint(options, cb) {
    return callbackOrPromise(cb, this.request('/api/setthermpoint', options));
};

NetatmoClient.prototype.switchSchedule = function switchSchedule(options, cb) {
    return callbackOrPromise(cb, this.request('/api/switchschedule', options));
};

NetatmoClient.prototype.createNewSchedule = function createNewSchedule(options, cb) {
    return callbackOrPromise(cb, this.request('/api/createnewschedule', options));
};

NetatmoClient.prototype.getPublicData = function getPublicData(options, cb) {
    return callbackOrPromise(cb, this.request('/api/getpublicdata', options));
};

NetatmoClient.prototype.partnerDevices = function partnerDevices(options, cb) {
    return callbackOrPromise(cb, this.request('/api/partnerdevices', options));
};

module.exports = NetatmoClient;
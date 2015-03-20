var NetatmoApi = require('../index');
var should = require('should');
var mocks = require('./mocks');

describe('NetatmoClient', function() {
    describe('constructor', function() {
        it('should return an object when both client id and client secret are passed', function() {
            var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
            should(client).be.an.instanceOf(NetatmoApi);
        });
        it('should throw an error if either client id or client secret are not passed', function() {
            try {
                new NetatmoApi({});
            } catch (error) {
                return;
            }
            throw new Error("Failed to throw error");
        });
        it('should throw an error if no config options is passed', function () {
            try {
               new NetatmoApi;
            } catch (error) {
                return;
            }
            throw new Error("Failed to throw error");
        });
    });
    describe('getToken', function() {
        it('should throw an InvalidClientError if client id and client secret are invalid', function(done) {
            var client = new NetatmoApi({ clientId: 'invalid', clientSecret: 'invalid' });
            client.getToken({}).then(function () {
                done(new Error('promise resolved instead of rejecting'));
            }).catch(NetatmoApi.errors.InvalidClientError, function () {
                done();
            }).catch(done);
        });
        describe('grant_type = password', function() {
            it('should resolve an access token if the username/password is valid', function(done) {
                var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
                client.getToken({
                    grant_type: 'password',
                    username: 'valid',
                    password: 'valid'
                }).then(function(token) {
                    should(token).have.property('access_token');
                    should(token).have.property('expires_in');
                    should(token).have.property('refresh_token');
                    done();
                }).catch(function (error) {
                    done(error);
                });
            });
            it('should throw an InvalidGrantError if the username/password is wrong', function(done) {
                var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
                client.getToken({
                    grant_type: 'password',
                    username: 'invalid',
                    password: 'invalid'
                }).then(function () {
                    done(new Error('promise resolved instead of rejecting'));
                }).catch(NetatmoApi.errors.InvalidGrantError, function () {
                    done();
                }).catch(done);
            });
        });
    });
    describe('getUser', function() {
        it('should resolve a user when a valid acess_token is passed', function(done) {
            var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
            client.getUser({ access_token: 'valid_access_token' }).then(function (user) {
                should(user).have.property('status','ok');
                should(user).have.property('body');
                done();
            }).catch(done);
        });
        it('should throw an AccessTokenExpiredError when an expired token is passed', function(done) {
            var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
            client.getUser({ access_token: 'expired_access_token' }).then(function () {
                done(new Error('promise resolved when it should have rejected'));
            }).catch(NetatmoApi.errors.AccessTokenExpiredError, function() {
                done();
            }).catch(done);
        });
        it('should throw an InvalidAccessTokenError when an invalid token is passed', function(done) {
            var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
            client.getUser({ access_token: 'invalid_access_token' }).then(function () {
                done(new Error('promise resolved when it should have rejected'));
            }).catch(NetatmoApi.errors.InvalidAccessTokenError, function() {
                done();
            }).catch(done);
        });
    });
});
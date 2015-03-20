var NetatmoApi = require('../index');
var should = require('should');
var mocks = require('./mocks');

describe('NetatmoClient', function() {
    describe('NetatmoClient (constructor)', function() {
        it('should return an object when both client id and client secret are passed', function() {
            var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
            should(client).be.an.instanceOf(NetatmoApi);
        });
        it('should throw an error if either client id or client secret are not passed', function() {
            try {
                new NetatmoApi({});
                new NetatmoApi({client_id:'test123'});
                new NetatmoApi({client_secret:'test123'});
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
    describe('request', function() {
        it('should throw an error if no path is given', function() {
           var client = new NetatmoApi({ clientId: 'test', clientSecret: 'test' });
           try {
               client.request();
           } catch (error) {
               return;
           }
           throw new Error('Error not caught');
        });
        it('should resolve a valid response object if the path and options are valid', function() {
            var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
            return client.request('/valid/api/path', { access_token: 'valid_access_token' })
                .then(function (response) {
                    should(response).have.property('status','ok');
                    should(response).have.property('body');
                });
        });
        it('should throw a NotFoundError if the api path is not valid', function(done) {
            var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
            client.request('/invalid/api/path', {})
                .then(function () {
                    done(new Error('promise resolved when it should have rejected'));
                })
                .catch(NetatmoApi.errors.NotFoundError, function() {
                    done();
                })
                .catch(done);
        });
        it('should throw a AccessTokenExpiredError if the access_token passed is expired', function(done) {
            var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
            client.request('/valid/api/path', { access_token: 'expired_access_token' })
                .then(function () {
                    done(new Error('promise resolved when it should have rejected'));
                })
                .catch(NetatmoApi.errors.AccessTokenExpiredError, function() {
                    done();
                })
                .catch(done);
        });
        it('should throw a AccessTokenInvalidError if the access_token passed is expired', function(done) {
            var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
            client.request('/valid/api/path', { access_token: 'invalid_access_token' })
                .then(function () {
                    done(new Error('promise resolved when it should have rejected'));
                })
                .catch(NetatmoApi.errors.AccessTokenInvalidError, function() {
                    done();
                })
                .catch(done);
        });
    });
    describe('callback based response handling', function() {
        it('should pass the error as the first argument to a callback', function(done) {
            var client = new NetatmoApi({ clientId: 'invalid', clientSecret: 'invalid' });
            client.getToken({}, function (err, result) {
                if (err) return done();
                done(new Error('Error not received'));
            });
        });
        it('should pass the result as the 2nd argument to a callback', function(done) {
            var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
            client.getToken({
                grant_type: 'password',
                username: 'valid',
                password: 'valid'
            }, function (err, token) {
                if (err) return done(err);
                should(token).have.property('access_token');
                should(token).have.property('expires_in');
                should(token).have.property('refresh_token');
                done();
            });
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
        describe('{ grant_type: \'password\' }', function() {
            it('should resolve an access token if the username/password is valid', function(done) {
                var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
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
                var client = new NetatmoApi({ clientId: 'valid', clientSecret: 'valid' });
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
});
var nock = require('nock');

var netatmo = nock('https://api.netatmo.net');

/**
 * Successful Client Authorization
 */
netatmo.post('/oauth2/token', {
    grant_type: 'password',
    username: 'valid',
    password: 'valid',
    client_id: 'valid',
    client_secret: 'valid',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(200,
    JSON.parse("{\"access_token\":\"542080451c775998ef579935|ea4855f21a6207b8750c487b773fefb5\",\"expires_in\": 10800,\"expire_in\": 10800,\"scope\": [ \"read_station\", \"read_thermostat\", \"write_thermostat\" ],\"refresh_token\": \"542080451c775998ef579935|b4231af13b4c711faa40e1eb57e1efcd\" }")
);

/**
 * Invalid client id and/or client secret
 */
netatmo.post('/oauth2/token', {
    client_id: 'invalid',
    client_secret: 'invalid',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(400, {
    error: "invalid_client"
});

/**
 * Invalid username and/or password
 */
netatmo.post('/oauth2/token', {
    grant_type: 'password',
    client_id: 'valid',
    client_secret: 'valid',
    username: 'invalid',
    password: 'invalid',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(400, {
    error: "invalid_grant"
});

/**
 * Expired Access Token
 */
netatmo.get('/valid/api/path?access_token=expired_access_token').reply(403, {
    error: {
        code: 3,
        message: "Expired access token"
    }
});

/**
 * Invalid access token
 */
netatmo.get('/valid/api/path?access_token=invalid_access_token').reply(403, {
    error: {
        code: 2,
        "message" : "Invalid access token"
    }
});

/**
 * Successful api call
 */
netatmo.get('/valid/api/path?access_token=valid_access_token').reply(200, {
    "status": "ok",
    "body": {}
});

/**
 * 404 not found api call
 */
netatmo.get('/invalid/api/path').reply(404, {
    "error" : {
        "code" : 404,
        "message" : "Not Found"
    }
});


module.exports = netatmo;
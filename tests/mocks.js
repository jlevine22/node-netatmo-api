var nock = require('nock');

var netatmo = nock('https://api.netatmo.net');

//
// Client Credentials Authorization
//

// Successful
netatmo.post('/oauth2/token', {
    grant_type: 'password',
    username: 'valid',
    password: 'valid',
    client_id: 'test',
    client_secret: 'test',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(200,
    JSON.parse("{\"access_token\":\"542080451c775998ef579935|ea4855f21a6207b8750c487b773fefb5\",\"expires_in\": 10800,\"expire_in\": 10800,\"scope\": [ \"read_station\", \"read_thermostat\", \"write_thermostat\" ],\"refresh_token\": \"542080451c775998ef579935|b4231af13b4c711faa40e1eb57e1efcd\" }")
);

// Invalid client id/secret
netatmo.post('/oauth2/token', {
    client_id: 'invalid',
    client_secret: 'invalid',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(400, {
    error: "invalid_client"
});

// Invalid username/password
netatmo.post('/oauth2/token', {
    grant_type: 'password',
    client_id: 'test',
    client_secret: 'test',
    username: 'invalid',
    password: 'invalid',
    scope: 'read_station read_thermostat write_thermostat'
}).reply(400, {
    error: "invalid_grant"
});

netatmo.get('/api/getuser?access_token=valid_access_token').reply(200, {
    "status": "ok",
    "body": {
        "_id": "542080451c775998ef579935",
        "administrative": {
            "country": "US",
            "reg_locale": "en-US",
            "lang": "en-US",
            "unit": 1,
            "windunit": 1,
            "pressureunit": 1,
            "feel_like_algo": 1
        },
        "date_creation": {
            "sec": 1411416133,
            "usec": 0
        },
        "devices": [
            "70:ee:50:03:9d:e6"
        ],
        "facebook_like_displayed": true,
        "mail": "josh.levine1@gmail.com",
        "timeline_not_read": 1,
        "usage_mark": 0.42572773404963
    }
});

netatmo.get('/api/getuser?access_token=expired_access_token').reply(403, {
    error: {
        code: 3
    }
});

netatmo.get('/api/getuser?access_token=invalid_access_token').reply(403, {
    error: {
        code: 2,
        "message" : "Invalid access token"
    }
});


module.exports = netatmo;
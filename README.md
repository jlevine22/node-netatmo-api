# netatmo-api

A node.js Netatmo API client that supports promises and callbacks

## Example Usage

Using promises:

    var NetatmoClient = require('../index');

    var client = new NetatmoClient({
    	clientId: 'YOUR_CLIENT_ID',
    	clientSecret: 'YOUR_CLIENT_SECRET'
    });

    client.getToken({
    	grant_type: 'password',
    	username: 'yournetatmoaccount@email.com',
    	password: 'yourpassword'
    }).then(function (token) {
        return client.getUser({ access_token: token.access_token });
    }).then(function (response) {
        console.log(response);
        // Do something with the response
    })
    .catch(NetatmoClient.errors.InvalidClientError, function (error) {
        console.log('Client id/Client secret credentials are invalid');
    })
    .catch(NetatmoClient.errors.AccessTokenExpiredError, function (error) {
        console.log('Access token is expired');
    })
    .catch(function (error) {
        console.log('Got some other error');
        console.log(error);
    });

Or if you prefer callbacks:

    var NetatmoClient = require('../index');

    var client = new NetatmoClient({
    	clientId: 'YOUR_CLIENT_ID',
    	clientSecret: 'YOUR_CLIENT_SECRET'
    });

    client.getToken({
    	grant_type: 'password',
    	username: 'yournetatmoaccount@email.com',
    	password: 'yourpassword'
    }, function (err, result) {
        if (err) {
            // Do something
            return;
        }
        client.getUser({ access_token: result.access_token }, function (err, result) {
            if (err) {
                // do something with error;
                return;
            }
            // Do something with the result
        })
    });
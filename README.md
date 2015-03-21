# netatmo-api

A node.js Netatmo API client that supports promises and callbacks. Read more about the Netatmo API here: [https://dev.netatmo.com/doc](https://dev.netatmo.com/doc).

## Installation
```
$ npm install https://github.com/jlevine22/node-netatmo-api.git --save
```

## Example Usage

Using promises:

    var NetatmoClient = require('netatmo-api');
	
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

    var NetatmoClient = require('netatmo-api');

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
    
## Notes
The client object has methods corresponding with the [methods of the api](https://dev.netatmo.com/doc). Each of these methods takes 2 arguments:
- `options` An object consisting of key/value pairs to be passed to the api.
- `callback` An optional error first callback

The [Netatmo API docs](https://dev.netatmo.com/doc) has details on what parameters are required for which calls.

## Errors
The Netatmo API client may throw the following errors:
- `ForbiddenError`
- `AccessTokenExpiredError`
- `AccessTokenInvalidError`
- `InvalidClientError` Thrown during a `client.getToken()` call if the clientId or clientSecret is invalid
- `InvalidGrantError` Thrown during a `client.getTOken()` call if the grant_type is 'password' and the username and/or password is incorrect.
- `NotFoundError`
- `Error`ß
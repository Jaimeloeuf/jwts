'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc Module description:
    - This module wraps over the jwt module to apply sign and verify options into the methods
      the jwt module before exporting the functions returned by these partial applications.
    - User to specify the sign and verify options directly in this module for every service
    - The DEFAULT OPTIONS MUST BE DEFINED, and they must be defined inside this module
    - Essentially the sign and verify options specific to this service is defined here
        - Their input interface is
            (payload, ?options)   where options object is optional.
    - Payload given to create_token function should only contain private claims and
      should not hold any of the pre-registered interoperable claim names and values.


    @TODO
    - Finnish writing the verification middleware
    - Start implementing JWEs (Is JWEs needed if there are stored in a HttpOnly cookie?)
*/

// Dependencies
// Directly call apply_keys method to get create and verify token methods with key-pair baked in
// const jwts = require('./jwt');
// const jwt = jwts.apply_keys();
const jwt = require('../index').apply_keys();


// This is a Express middleware for routes that require JWT security
function get_token(req, res, next) {
    // Save token for subsequent functions to access token with request object after this middleware
    req.token = jwt.extract_jwt_in_header(req);
    // End the req/res cycle if no token is sent
    if (typeof req.token === 'undefined')
        res.status(401).end(''); // If token does not exist or not sent over, respond with a 401 auth-token not provided
    // ^To update the response message, either with a 401 HTML page or smth
}

// Default JWT Signing options object
const signOptions = {
    issuer: 'Mysoft corp',
    subject: 'some@user.com',
    // audience: 'https://Promist.io',
    audience: ['https://Promist.io', '.... all the services names'],
    expiresIn: '10m', // Give the token a 10min lifetime
    algorithm: 'RS256' // Must be RS256 as using asymmetric signing
};

// Default JWT Verification options object
const verifyOptions = {
    issuer: 'Mysoft corp',
    subject: 'some@user.com',
    // audience: 'https://Promist.io',
    audience: ['https://Promist.io', '.... all the services names'],
    algorithm: ['RS256'] // Unlike signOption that we used while signing new token , we will use verifyOptions to verify the shared token by client. The only difference is, here the algorithm is Array [“RS256”].
};


module.exports = {
    // The middleware for extracting token into request object's token property
    get_token,

    // Functions from the jwt module with default options object applied into their closures
    create_token: jwt.create_token(signOptions),
    verify_token: jwt.verify_token(verifyOptions),

    // Export method for getting public key with from the jwt module
    getPublicKey: () => jwt.publicKey
}
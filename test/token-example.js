'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
    Unit test for 'jwts' module's create/read/sign/verify operations on a given token

    - This module wraps over the jwt module to apply sign and verify options into the methods
      the jwt module before exporting the functions returned by these partial applications.
    - User to specify the sign and verify options directly in this module for every service
    - The DEFAULT OPTIONS MUST BE DEFINED, and they must be defined inside this module
    - Essentially the sign and verify options specific to this service is defined here
        - Their input interface is
            (payload, ?options)   where options object is optional.
    - Payload given to create_token function should only contain private claims and
      should not hold any of the pre-registered interoperable claim names and values.
*/

// Dependencies
// Directly call apply_keys method to get create and verify token methods with key-pair baked in
const jwt = require('../src/index').apply_keys();

// Shorthand utility binding
const print = console.log;

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


// Functions from the jwt module with default options object applied into their closures
const create_token = jwt.create_token(signOptions);
const verify_token = jwt.verify_token(verifyOptions);

const token = {
    id: 1,
    username: 'brad',
    email: 'brad@gmail.com',
    role: 'user'
};


function promise_version() {
    // Using the token module's API with Promises
    create_token(token, { subject: 'bryan@gmail.com' })
        .then(token => {
            print(token);
            print(token.length);
            return token;
        })
        .then((token) => verify_token(token, { subject: 'bryan@gmail.com' }))
        .then((token) => {
            print(token);
            print(token.role);
        })
        .catch(print);
}


async function asyncawait_version() {
    // Using the token module's API with the Async/Await keywords
    try {
        const token = await create_token(token);
        print(token);
        print(token.length);
        const decoded_token = await verify_token(token);
        print(decoded_token);
        print(decoded_token.sub);
    } catch (err) {
        print(err);
    }
}


async function test() {
    /*  The 2 Async functions below are called with await keyword, to make sure that
        the execution pauses at after call until the async function resolves or ends.
        Thus allowing proper execution scheduling/structuring with the async code.
    */
    await promise_version();
    await asyncawait_version();
    /*  If functions are ran without the await keywords, they will not execute in order
        and thus the results will show both functions printing out the token and length
        one by one before printing out the decoded token with role one by one.
    */
    // promise_version();
    // asyncawait_version();

    // Resolve with the 'finnished' word upon the above 2 promises resolving
    return 'finnished';
}
// Call the test function, and when the returned Promise resolves, print out the value resolved
test()
    .then(print);
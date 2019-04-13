'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc Module description:
    Unit test for the tokens module's create/read/sign/verify operations on a given token

    @TODO
	- look into private Keys and stuff like Asymmetric signing and verifying
    - Do a load testing
*/

// Destructure the methods out from the module for testing
const { create_token, verify_token, getPublicKey } = require('./token');
// Shorthand utility binding
const print = console.log;


/*  Req object mimicking req objects before being processed by the create_token method.
    Before user have a JWT, and they just posted their credentials for a JWT */
const req = {
    // Mock user object as payload for testing purposes
    token: {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com',
        role: 'user'
    },
    res_headers: {}
}


function promise_version() {
    // Using the token module's API with Promises
    create_token(req.token, { subject: 'bryan@gmail.com' })
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
        const token = await create_token(req.token);
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

// Call getPublicKey function to get the public Key used.
print(getPublicKey());
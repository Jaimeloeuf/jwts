'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc Module description:
    This module is a wrapper over the 'jsonwebtoken' package to create/read/sign/verify a token,
    but with added automatically generated asymmetric key-pair on startup.

    @TODO
    - Create a global variable to store the current publicKey used, which will be set every time the
      apply_keys function is ran or when the node-forge based publicKey generation function is ran.
    - Try to move the wrapper functions from token module over to this module.
    - Do JsDocs for this module before publishing
    - Create 1 Function to extract JWTs from header or token automatically.
    - Add a function to coerce Auth header to either all lower or upper case (No need if using Express)
        ^ Basically use a regex to specify all case-insensitive?
        ^ Loop over all the properties in the request header and try to find a match using regex
    - Write unit test for this module
    - Start implementing JWEs
    - Create interface or give option for the Public/Private key pair to be generated and changed repeatedly.

    If using the node-forge thing to gen public key from the private key, no need to expose the private
    keys because in the function of private key generation, can just insert the private key into
    the node forge function closure.
*/

// Dependencies
const jwt = require('jsonwebtoken'); // External dependency from NPM by Auth0
const { promisify } = require('util');
// Forge crypto package for node (https://www.npmjs.com/package/node-forge)
// const forge = require('node-forge');


// Super simple utility function for merging objects. Only shadow merging is needed.
const merge = (o1) => (o2) => ({ ...o1, ...o2 });

// Using the promisify method from the util module, Promisify the original jwt methods
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

// Promisified sign method curried. Resolves with signed JWT, else rejects with an error.
const create_token = (private_key) => (signOption) => (payload, options = {}) => sign(payload, private_key, merge(signOption)(options));
// Promisified verify method curried. Resolves with the decoded token, else rejects with an error.
const verify_token = (public_key) => (verifyOption) => (token, options = {}) => verify(token, public_key, merge(verifyOption)(options));


// Function to generate the Public/Private key pairs.
function generateKeys() {
    // Import and cache in memory only when used to generate keys. Garbage collected when function ends
    const { generateKeyPairSync } = require('crypto');

    // Generate a key with the RS256 algorithm.
    return generateKeyPairSync('rsa', {
        modulusLength: 1024, // Can be changed to be longer like 4096 for added security
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
}


// Function to get a create and verify token method with Asymmetric Keys built into them.
function apply_keys() {
    /*  Generate Key pair and apply these keys into the curried functions' closure
    
        The public key is also returned, for use with other services, but the
        privateKey will be destroyed along with this function scope when it ends.
        
        Return object with the new create and verify token methods with the Keys applied
    */
    const { publicKey, privateKey } = generateKeys();
    return {
        publicKey,
        create_token: create_token(privateKey),
        verify_token: verify_token(publicKey)
    };
}


// Attempt to create a function to forge a public key based on a private key using node-forge
function forgeKey(privateKey) {
    return function () {
        // convert PEM-formatted private key to a Forge private key
        const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
        // get a Forge public key from the Forge private key
        const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);
        // convert the Forge public key to a PEM-formatted public key
        const publicKey = forge.pki.publicKeyToPem(forgePublicKey);

        return publicKey;

        // Below is a curried version with arrow functions
        // Given a private key, get a function that can generate a public key
        // const getPublicKey = (forgePrivateKey) => () => forge.pki.publicKeyToPem(forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e));
    }
}


const extract = {
    // Only for services where the JWT is passed in the Auth HTTP header
    /*  Pure function to extract token from request header and returns it
        FORMAT OF TOKEN --> Authorization: Bearer <access_token>
        Split on space, get token from array and return it.
        Express automatically coerces keys in the header object to be lowercase. */
    jwt_in_header: (req) => req.headers['authorization'].split(' ')[1],

    // Only for web-apps where the JWT is passed as a cookie
    jwt_in_cookie: (req) => req.cookies.jwt,

    // Function for extracting CSRF token from the request from a web-app client
    CSRF_token: (req) => req.headers['x-csrf-token'],
}


module.exports = {
    // All the token extraction related functions as 1 extraction object
    extract,

    // The 2 curried functions for token signing and verification
    create_token,
    verify_token,

    /*  Function to generate a new key pair and apply it into the curried functions' closure.
        Exporting the with the key in their closures */
    apply_keys,

    // getPublicKey is exported for other modules/services to get latest public key to verify the JWT
    getPublicKey: () => publicKey
}


/*	Docs and Notes:

    What should a JWT contain?   (Client holding the JWT will be referred to as the owner)
	- The owner's Identity, basically declaring who the user is
	- What are the resources that the owner can access.
	- Who issused the JWT token to the user
	- And who is the JWT intended for? Meaning who or which microservice should accept the token?
	standard token
	headers:
		{
			"typ": "JWT",
			"alg": "HS256" // The algorithm used for the signature is HMAC SHA-256
		}
		{
			// Who this person is (sub, short for subject)
			// What this person can access with this token (scope)
			// When the token expires (exp)
			// Who issued the token (iss, short for issuer)
			// These below declarations are known as Claims, because the token creator claims a set of assertions that can be used to ‘know’ things about the subject. Because the token is signed with a secret key, you can verify its signature and implicitly trust what is claimed.
			"exp": ,
			"iat": ,
			"expiresIn": ,
			"tokenType": "Bearer",
			"sub":
			"subject": "retrieve data", // What is the purpose of this token/request?
			"usrID": 578ec9,
			"usr": "john@gmail.com",
			"iss": "bouk.com", // Issuer of the token
			"aud": "bouk.com/", // Intended audience that should acccept the token
			"account type": "consumer", // The type of account that the user has
			"roles": {
				// The things/roles that the user is allowed to do
				"role": "consumer"
				"booking": "create"
			}
			"scope": ["read", "write", "update", "del"]
        }

    JWTs are used for stateless Auth and in a stateless request
    meaning that it should contain all and just enough data to make the request valid and enough
    for generating the response back
    Do not put too much claims or data into the JWT. Only what is needed

    the payload will say what is the token used for. E.g. identity token / information token...
*/
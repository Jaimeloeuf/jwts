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
const { sign, verify } = require('./jsonwebtoken');
const generateKeys = require('./generateKeys');
const extract = require('./extract');
// Forge crypto package for node (https://www.npmjs.com/package/node-forge)
// const forge = require('node-forge');


// Super simple utility function for merging objects. Only shadow merging is needed.
const merge = (o1) => (o2) => ({ ...o1, ...o2 });

// Promisified sign method curried. Resolves with signed JWT, else rejects with an error.
const create_token = (private_key) => (signOption) => (payload, options = {}) => sign(payload, private_key, merge(signOption)(options));
// Promisified verify method curried. Resolves with the decoded token, else rejects with an error.
const verify_token = (public_key) => (verifyOption) => (token, options = {}) => verify(token, public_key, merge(verifyOption)(options));


// Function to get a create and verify token method with Asymmetric Keys built into them.
function apply_keys() {
    /*  Generate Key pair and apply these keys into the curried functions' closure
    
        The public key is also returned, for use with other services, but the
        privateKey will be destroyed along with this function scope when it ends.
        
        Return object with the new create and verify token methods with the Keys applied
    */
    const { publicKey, privateKey } = generateKeys();
    return {
        getPublicKey: () => publicKey,
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


module.exports = {
    // All the token extraction related functions as 1 extraction object
    extract,

    // The 2 curried functions for token signing and verification
    create_token,
    verify_token,

    /*  Function to generate a new key pair and apply it into the curried functions' closure.
        Exporting the methods with the keys applied into their closures already */
    apply_keys,

    // getPublicKey is exported for other modules/services to get latest public key to verify the JWT
    getPublicKey: () => publicKey
}
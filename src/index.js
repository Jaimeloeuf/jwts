"use strict"; // Enforce use of strict verion of JavaScript

/**
 * This module is a wrapper over the 'jsonwebtoken' package to create/read/sign/verify a token,
 * but with added automatically generated asymmetric key-pair on startup.
 *
 * @todo Create global variable to store the current publicKey used, which is set every time applyKeys function or node-forge based publicKey generation function is ran.
 * @todo Try to move the wrapper functions from token module over to this module.
 * @todo Create 1 Function to extract JWTs from header or token automatically.
 * @todo Add a function to coerce Auth header to either all lower or upper case (No need if using Express)
 *      - Basically use a regex to specify all case-insensitive?
 *      - Loop over all properties in the request header to find a match using regex
 * @todo Implement JWEs
 * @todo Create interface or give option for the Public/Private key pair to be generated and changed repeatedly.
 *
 * @notes If using the node-forge thing to gen public key from the private key, no need to expose the private
 *      keys because in the function of private key generation, can just insert the private key into
 *      the node forge function closure.
 */

// Dependencies
const { sign, verify } = require("./jsonwebtoken");
const generateKeys = require("./generateKeys");
const extract = require("./extract");
// Forge crypto package for node (https://www.npmjs.com/package/node-forge)
// const forge = require('node-forge');

// Super simple utility function for merging objects. Only shadow merging is needed.
const merge = o1 => o2 => ({ ...o1, ...o2 });

// Promisified sign method curried. Resolves with signed JWT, else rejects with an error.
const createToken = privateKey => signOption => (payload, options = {}) =>
  sign(payload, privateKey, merge(signOption)(options));
// Promisified verify method curried. Resolves with the decoded token, else rejects with an error.
const verifyToken = publicKey => verifyOption => (token, options = {}) =>
  verify(token, publicKey, merge(verifyOption)(options));

// Function to get a create and verify token method with Asymmetric Keys built into them.
function applyKeys(key_length = 2048) {
  /*  Generate Key pair and apply these keys into the curried functions' closure

        The public key is also returned, for use with other services, but the
        privateKey will be destroyed along with this function scope when it ends.

        Return object with the new create and verify token methods with the Keys applied
    */
  const { publicKey, privateKey } = generateKeys(key_length);
  return {
    getPublicKey: () => publicKey,
    createToken: createToken(privateKey),
    verifyToken: verifyToken(publicKey)
  };
}

// Attempt to create a function to forge a public key based on a private key using node-forge
function forgeKey(privateKey) {
  return function() {
    // convert PEM-formatted private key to a Forge private key
    const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
    // get a Forge public key from the Forge private key
    const forgePublicKey = forge.pki.setRsaPublicKey(
      forgePrivateKey.n,
      forgePrivateKey.e
    );
    // convert the Forge public key to a PEM-formatted public key
    const publicKey = forge.pki.publicKeyToPem(forgePublicKey);

    return publicKey;

    // Below is a curried version with arrow functions
    // Given a private key, get a function that can generate a public key
    // const getPublicKey = (forgePrivateKey) => () => forge.pki.publicKeyToPem(forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e));
  };
}

module.exports = {
  // All the token extraction related functions as 1 extraction object
  extract,

  // The 2 curried functions for token signing and verification
  createToken,
  verifyToken,

  /*  Function to generate a new key pair and apply it into the curried functions' closure.
        Exporting the methods with the keys applied into their closures already */
  applyKeys
};

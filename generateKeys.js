'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
    900kb of ram
*/

// Import and cache in memory only when used to generate keys. Garbage collected when function ends
const generateKeyPairSync = (function () {
    try {
        // return { generateKeyPairSync } = require('crypto');
        return ({ generateKeyPairSync } = require('crypto'));
    } catch (err) {
        console.error(err);
    }
})()

// Function to generate the Public/Private key pairs.
function generateKeys() {
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

module.exports = generateKeys;
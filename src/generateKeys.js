'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
    Module exports a function that is able to generate the RSA key pair
    All the settings/options for the key generation are hard coded in this module

    ------------------
    Question:
        Why is the require module in the generateKeys function?

    tl;dr
        Module is lazy loaded in the function where it is used for stability and safety
        reasons rather than for performance reasons.

    Answer:
        The crypto module is only "required" in this function where the "generateKeyPairSync" method is used.
        This is because if the crypto module is unavailable but not used by the package, then the package should not
        attempt to import it, as it will cause import error to be thrown for users who are not even using the automatic
        key generation feature, which means it will break backward compatability with older node versions and systems
        where the native crypto module is purposefully removed as they have their own ways of doing secret management.
    ------------------

    @Todo
    - Create a configuration moudule to allow user to change the key generation options
*/


// Function to generate the Public/Private key pairs.
function generateKeys(modulusLength = 2048) {
    const { generateKeyPairSync } = require('crypto');
    // Generate a key with the RS256 algorithm.
    return generateKeyPairSync('rsa', {
        modulusLength, // Can be changed to be longer like 4096 for added security
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
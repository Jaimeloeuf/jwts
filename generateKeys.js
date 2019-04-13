'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
    Module exports a function that is able to generate the RSA key pair
    All the settings/options for the key generation are hard coded in this module

    @Todo
    - Create a configuration moudule to allow user to change the key generation options
*/


const generateKeyPairSync = (function () {
    try {
        return require('crypto').generateKeyPairSync;
    } catch (err) {
        // Log error either to console, log file or logging service
        console.error(err);

        // Force the entire process to stop and kill all async processes!
        process.exit(1);
        // Below is a safer process, by killing the process with a thrown error.
        // throw new Error(err);
    }
})()


// Function to generate the Public/Private key pairs.
function generateKeys(modulusLength = 2048) {
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
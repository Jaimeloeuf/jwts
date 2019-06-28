'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
    Module exports a function that is able to generate the RSA key pair
    All the settings/options for the key generation are hard coded in this module

    @Todo
    - Create a configuration moudule to allow user to change the key generation options
*/


// const generateKeyPairSync = (function () {
//     try {
//         return require('crypto').generateKeyPairSync;
//     } catch (err) {
//         /*  Previously, when the crypto module is not available,
//             The entire process was forced to stop and all async processes killed, using "process.exit(1);"

//             Below is a safer process, by killing the process with a thrown error. */
//         // throw new Error(err);

//         // The safest way is to just notify user about it and let the process continue running.
//         console.log(err)
//     }
// })()

/*  tl;dr
    Module is lazy loaded for stability and safety reasons rather than for performance reasons.

    Explaination:
    Wrapped the crypto require code in a function, as a lazy loaded module.
    This is because if the crypto module is unavailable but not used by the package,
    then the package should not attempt to import it, as it will cause import error
    to be thrown for users who are not even using the automatic key generation feature,
    which means it will break backward compatability with older node versions and systems
    where the native crypto module is purposefully removed as they have their own ways of
    doing secret management.    */
const generateKeyPairSync = (() => require('crypto').generateKeyPairSync)();


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
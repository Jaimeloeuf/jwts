"use strict"; // Enforce use of strict verion of JavaScript

/**
 * Module exports a function that is able to generate the RSA key pair
 * All settings/options for the key generation are hard coded in this module
 *
 * Question:
 *      Why is the require module in the generateKeys function?
 *
 * tl;dr
 *      Module is lazy loaded into function for stability and safety reasons, and not for performance gains.
 *
 * Answer:
 *      The crypto module is only "required" in this function where the "generateKeyPairSync" method is used.
 *      Because if crypto module is unavailable but not used by the package, then the package should not attempt to
 *      import it, as it will cause import errors for users who are not even using automatic key generation,
 *      meaning it will break backward compatability with older node versions and systems where the native crypto
 *      module is purposefully removed for security reasons.
 *
 *
 * @Todo Create a configuration moudule to allow user to change the key generation options
 */

/**
 * Generate Public/Private key pairs using 'crypto'
 * @function generateKeys
 * @param {number} modulusLength Length of the modulus used to generate the key pair
 */
function generateKeys (modulusLength = 2048) {
  try {
    const { generateKeyPairSync } = require("crypto");
    // Generate a key with the RS256 algorithm.
    return generateKeyPairSync("rsa", {
      modulusLength, // Can be changed to be longer like 4096 for added security
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    });
  } catch (err) {
    console.log(
      "'jwts' package failed to load as 'crypto' is not available, applyKeys() function requires 'crypto'"
    );
    console.error(err);
  }
}

module.exports = generateKeys;

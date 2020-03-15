'use strict'; // Enforce use of strict verion of JavaScript

/**
 * Unit test for the jwt module.
 */

const assert = require('assert');


describe('Import test', function () {
    it('jwts module', () => assert(require('../src/index'), "Failed to import 'jwts' module"));
    it('Crypto, used for automatic key generation', () => assert(require("crypto"), "Failed to import 'crypto' module"));
});


describe('Normal jwts usage', function () {
    const jwts = require('../src/index');

    it('Jwts create token', () => assert(jwts.create_token(), 'Create token method failed'));
});


/**
 * @notice Call apply_keys functions and destructure the stuff out to auto gen a key pair and inject it into the functions
 * @notice If you just want to use verify token with a key you have, then skip the above
 */
describe('jwts with apply_keys() usage', function () {
    const jwts = require('../src/index').apply_keys();

    it('Public Key generation', () => assert(jwts.getPublicKey(), "Public Key generation failed"));
});
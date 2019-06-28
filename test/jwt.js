'use strict'; // Enforce use of strict verion of JavaScript

/*  @Doc
    Unit test for the jwt module.
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


/*  - Everytime you want to use a auto gen key pair that is injected into the functions,
    call the apply_keys functions and destructure the stuff out.
    - If you just want to use verify token with a key you have, then skip the above shit.
*/
describe('jwts with apply_keys() usage', function () {
    const jwts = require('../src/index').apply_keys();

    it('Public Key generation', () => assert(jwts.getPublicKey(), "Public Key generation failed"));
});
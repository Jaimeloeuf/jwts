'use strict'; // Enforce use of strict verion of JavaScript

const assert = require('assert');

const print = console.log;

// Import the jwts main module
const jwts = require('../index');

it('', () => {
    // assert.equal(true, true);
    assert(true, 'True assertion failed')
});

it('', () => {
    // assert.equal(true, true);
    assert(jwts.create_token(), 'True assertion failed')
});

"use strict"; // Enforce use of strict verion of JavaScript

/**
 * This is a wrapper module over the jsonwebtoken dependency
 * package to export its methods after Promisfying them.
 *
 * Export an object with only the Promisified sign and verify methods.
 * Self invoking function to bundle import and Promisification of the sign and verify methods
 * All modules are imported here and garbage collected when function ends.
 */
module.exports = (function () {
  // External dependency from NPM by Auth0
  const { sign, verify } = require("jsonwebtoken");
  // Promisify method to change original jsonwebtoken methods to return a Promise
  const { promisify } = require("util");

  // Promisify jwt methods and return them as new standalone functions to be destructured out.
  return { sign: promisify(sign), verify: promisify(verify) };
})();

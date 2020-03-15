"use strict"; // Enforce use of strict verion of JavaScript

/**
 * Module holds all the functions for extracting JWTs and CSRF tokens
 * Module is designed for use with Express's request objects.
 */

module.exports = {
  /**
     * @notice These functions are only for services where the JWT is passed in the Auth HTTP header
     * @notice Pure functions to extract token from request header and returns it
     *
     * FORMAT OF TOKEN --> Authorization: Bearer <access_token>
     * Split on space, get token from array and return it.
     * Express automatically coerces keys in the header object to be lowercase.
     */
  jwt_in_header: (req) => req.headers.authorization.split(" ")[1],

  // Only for web-apps where the JWT is passed as a cookie
  jwt_in_cookie: (req) => req.cookies.jwt,

  // Function for extracting CSRF token from the request from a web-app client
  CSRF_token: (req) => req.headers["x-csrf-token"]
};

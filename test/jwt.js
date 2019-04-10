'use strict'; // Enforce use of strict verion of JavaScript

/*  @Doc
    Unit test for the jwt module.
*/

const jwt = require('../jwt');

/*
    Everytime you want to use a auto gen key pair that is injected into the functions,
    call the apply_keys functions and destructure the stuff out.

    If you just want to use verify token with a key you have, then skip the above shit.
*/

const jwt = require('./jwt').apply_keys();
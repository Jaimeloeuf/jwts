# jwts
A package for Signing/Creating and Verifying JWTs, with build in asymmetric key pair generation for the token signature with the crypto module.  
[NPM package link](https://www.npmjs.com/package/jwts)

## Installation
```cli
# Install into node_modules/ and save as dependency in package.json
npm i jwts

# Install package to use in production without installing the package's devDependencies
npm i jwts --production
```

## How to use
- For examples on how to use this package, refer to the modules in the "example_code" directory. It includes a comprehensive list of all use cases for this package.
- To see how you can use this package to build a full Identity and Access Management service, refer to [this](https://github.com/Jaimeloeuf/police-man) IAM microservice for example.
###### Basic usecase (Note that all import statements are sync/blocking):
```js
// Require jwts to use the methods without using automated Key generation and binding
const jwt = require('jwts');

/* Assuming you got the publicKey from a secret management service. Create
   a verification function by partially applying in the publicKey and the
   default verification options.	*/
const verify = jwt.verify_token(publicKey)({
	issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
})

// Assuming the "jwt" is the jwt you want to verify
verify(jwt);

// Assuming you want to verify the jwt, with a different set of options
verify(jwt, {
	audience: "admin_service" // Optional options to override your default options
});
```
```js
/* Directly call the "apply_keys" method if you want to both create and verify the
   tokens with automatically generated RSA key pair binded into the functions.	*/
const jwt = require('jwts').apply_keys();

jwt.getPublicKey(); // Get the generated publicKey

/*	Apply default options object into the create and verify functions */
const create = jwt.create_token({
	issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
});
const verify = jwt.verify_token({
	issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
});


const token = create({
	user: "james",
    roles: "admin"
}); // Expected output is the encoded token

verify(token);
// Expected output is the decoded token if correct, else an error
```

## JWTs, general structure and F.A.Qs
##### F.A.Q
- What should a JWT contain?   (Client holding the JWT will be referred to as the owner)
  - The token should be self-identifying of its use, e.g. identity token / information token...
  - The owner's Identity, basically declaring who the user is
  - What are the resources that the owner can access.
  - Who issued the JWT to the user
  - Who is the JWT intended for? Meaning which microservices should accept the token?
  - The access right of the owner. (What are the resources he or she is allowed to access)
  - JWTs should contain all data needed to fulfill the request and nothing more.
  - Do not put unnecessary claims into the JWT such as user data. (Keep these in the DB)
- What are JWTs used for?
  - JWTs are used for stateless Authentication
  - JWTs are used to prove access rights of a bearer
  - JWTs facilitate trusted data transfer in a stateless request
##### Example on what a JWT contains
```js
    {
    	// Token headers
        "typ": "JWT",
        "alg": "HS256" // The algorithm used for the signature is HMAC SHA-256
    }
    {
        // Who this person is (sub, short for subject)
        // What this person can access with this token (scope)
        // When the token expires (exp)
        // Who issued the token (iss, short for issuer)
        // These below declarations are known as Claims, because the token creator claims a set of assertions that can be used to ‘know’ things about the subject. Because the token is signed with a secret key, you can verify its signature and implicitly trust what is claimed.
        "exp": ,
        "iat": ,
        "expiresIn": ,
        "tokenType": "Bearer",
        "sub":
        "subject": "retrieve data", // What is the purpose of this token/request?
        "usrID": 578ec9,
        "usr": "john@gmail.com",
        "iss": "bookings.com", // Issuer of the token
        "aud": "bookings.com/", // Intended audience that should acccept the token
        "account type": "consumer", // The type of account that the user has
        "roles": {
            // The things/roles that the user is allowed to do
            "role": "consumer"
            "booking": "create"
        }
        "scope": ["read", "write", "update", "del"]
    }
```


## Dependencies
- If token signing feature is to be used, then the native [crypto](https://nodejs.org/api/crypto.html) module must be available for automatic RSA key generation and binding.
- Note that if the native crypto module is not available, the process will be forced to quit!
- This package is built on top of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package, thus the dependencies includes the jsonwebtoken package and its dependencies.

## Author
2019 Jaime Loeuf
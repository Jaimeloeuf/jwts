# jwts
**jwts** is a package for Signing/Creating and Verifying JWTs, more specifically JWS', with build in asymmetric key pair generation support for the digital signature using the native crypto module.  
- [Github Homepage](https://github.com/Jaimeloeuf/jwts)  
- [NPM package site](https://www.npmjs.com/package/jwts)  

The package name "jwts" is made by combining both JWT and JWS.  
**JWT** is the *JSON Web Token* specification, while **JWS** is the specification where a digital Signature of the JWT is included at the end of the JWT, to act as an anti-tamper measure. This package helps you to easily create **JWS** by dealing with the generation of Public/Private key pair, so you can just focus on writing the options and tokens to sign and verify.


## Project status
This project follows [Semantic Versioning](https://semver.org/)
- MAJOR version updates means incompatible API changes.
- MINOR version updates means added functionality or change of implementation in a backwards-compatible manner.
- PATCH version means bug fixes or minor updates that are backwards-compatible.

Please view the documentation of latest changes in this [CHANGELOG.md](https://github.com/Jaimeloeuf/jwts/blob/master/CHANGELOG.md) file on the Github repository to see what has changed in the latest versions!  
Please visit the Github [repo](https://github.com/Jaimeloeuf/jwts) for latest and most updated commits/changes. Versions published on NPM are more or less stable for use and are not updated as often as the remote repo.  
If you plan on using this package in production, or share code that uses this package as dependency with others, always make sure that your code is working fine with the package using your tests, before locking the version you used in your dependency list. This is to prevent the package from being updated causing errors due to any possible breaking changes across the different versions, which may break your application, causing pain and tears.

Note that this package is in currently in the beta phase, although it is mostly stable. Once all the tests has been written and a CI/CD pipeline is built out for this package, I will create a new Major version for release that will be marked as "Production Ready". If you have any issues, please open them on the Github page, contributions or comments are all welcomed too. My email is [here](mailto:jaimeloeuf@gmail.com) if you would like to reach out. Thanks for giving this a try!


## Installation
```cli
# Install into node_modules/ and save as dependency in package.json
npm i jwts

# Install package to use in production without installing the package's development dependencies
npm i jwts --production
```
This package, when installed using npm, contains only the required source files, README and CHANGELOG files in the distribution package without all the tests and example codes.  
To view the full implementation with tests and example codes, clone this repository from [Github](https://github.com/Jaimeloeuf/jwts) instead.  
```cli
git clone https://github.com/Jaimeloeuf/jwts
```


## Dependencies
- **Crypto Module** If token signing feature is to be used, then the native [crypto](https://nodejs.org/api/crypto.html) module must be available for automatic RSA key generation and binding, else the process will fail from the error thrown.
- This package is built on top of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package, thus the dependencies includes the jsonwebtoken package and its dependencies.

Node Versions Compatibility:
This package should work with most modern Node JS versions, but this has only been tested on Node v10.  
Will be building automated tests to run this package on different versions of node, to get a bigger picture for compatibility.


## How to use
- For examples on how to use this package, refer to the modules in the "example_code" directory. It includes a comprehensive list of all use cases for this package. Download the repo from the Github page, to access this directory.
- To see how you can use this package to build a full Identity and Access Management service, refer to [this](https://github.com/Jaimeloeuf/police-man) IAM microservice for example.
###### Basic use case:
```js
// Note all import statements here are synchronous & blocking. Lazy loading is recommended if the use is optional.
// Require jwts to use the methods without using automated Key generation and binding
const jwt = require('jwts');

/* Assuming you got the publicKey from a secret management service. Create
   a verification function by partially applying in the publicKey and the
   default verification options.	*/
const verify = jwt.verifyToken(publicKey)({
	issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
})


/*  Assuming the "jwt" is the jwt you want to verify
    "verify" will return a Promise, that will resolve with the verified and decoded token,
    else it will reject with an error if the verification failed.   */
verify(jwt);

// Assuming you want to verify the jwt, with a different set of options
verify(jwt, {
	audience: "admin_service" // Optional options to override your default options
});
```
```js
/* Directly call the "applyKeys" method if you want to both create and verify the
   tokens with automatically generated RSA key pair binded into the functions.	*/
const jwt = require('jwts').applyKeys();

jwt.getPublicKey(); // Get the generated publicKey

/* Apply default options object into the create and verify functions */
const create = jwt.createToken({
    issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
});
const verify = jwt.verifyToken({
    issuer: "auth-backend",
    audience: "my_service"	// Enter your default verify token options
});


// Self invoked async function to use await on the Promises
(async function() {
    /*  "create" returns a Promise,
        that will resolve with the signed and encoded token,
        else it will reject with an error.  */
    const token = await create({
        user: "james",
        roles: "admin"
    });
    
    /*  "verify" returns a Promise, that will resolve with the verified and decoded token,
        else it will reject with an error if the verification failed.   */
    const decoded_token = await verify(token);
})()
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
A good resource is on the jwt.io [website](https://jwt.io/introduction/).  
From here on out, the client browser who holds the JWT, or a service or whatever that holds the JWT, will be referred to as the **bearer**.  
In a JWT, especially one used as identity validator, it is suggested that you include the following key:value pairs:
- "sub", short for subject
    - This value should allow the service to identitfy Who this person is, or who is the bearer of this identity token
- "scope"  /  "roles"
    - Include a key:value pair that stores an array as the value
    - The array should allow the service accepting the tokens to determine What this person can access with this token
    - This should include things like read/write permissions to data in the database, service / application specific actions such as for example "account creation".
    - The scope should be used for laying out the permissions, and the roles should define the the !!!!Group Access Policies!!!!!!
        - Basically access management grouped by what type of user is this.
        - So there should be another part of the service that specifically defines all user groups, and the actions that they are allowed to do.
- When the token expires (exp)
- Who issued the token (iss, short for issuer)
```js
    {
    	// Token headers
        "typ": "JWT",
        "alg": "HS256" // The algorithm used for the signature is HMAC SHA-256
    }
    {
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


## Licensing, Contributing and Author
This package is made under the MIT license, feel free to use it however you like.  
Feel free to fork and contribute to this project! If you need help or have any queries, feel free to reach out to me [here](mailto:jaimeloeuf@gmail.com), or simply create an issue on the Github page.  
2019 - [Jaime Loeuf](https://github.com/Jaimeloeuf)
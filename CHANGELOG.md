# Changelog for "jwts" package
This file documents the changes made to the package, ordered by the version numbers that the change was published under on NPM.  
This project follows [Semantic Versioning](https://semver.org/).  
- MAJOR version updates means incompatible API changes,
- MINOR version updates means added functionality or change of implementation in a backwards-compatible manner
- PATCH version means bug fixes or minor updates that are backwards-compatible.

## [2.0.0] - 16/03/20
### Highlight
- The API now uses camelCase.
### Added
- linter, lint configuration files and npm run script for linting
### Changed
- Ran linter on all files thus files have been modified and changed.
- The API has changed to use camelCase now.
- Updated the code comments and documentations to use JSDoc

## [1.2.9] - 19/07/19
### Highlight
- Updated dependencies due to security vulnerability with lodash.
### Changed
- Updated dependencies


## [1.2.8] - 30/06/19
### Highlight
- README Cleanup, bug fixes and easier package development flow added.
### Added
- Added new dev dependency, nodemon, and new npm script for developers to use the nodemon dependency to auto restart test on file change.
### Changed
- Changed the code that does the lazy loading of the Crypto module to actually work, fixing mistake from the past implementation.
- Updated the README
### Removed
- Removed potentially bug causing code that exports a value that is always undefined from the main module.


## [1.2.6] - 22/06/19
### Highlight
- Pushed this Changelog file into the Github repo and included it into the npm release.
### Added
- Included this Changelog file into the code repo and in the npm release.
- Added a new link inside README.md to open this file in Github.


## [1.2.5] - 14/06/19
### Highlight
- This version fixes the bug that prevented users from accessing the package in the previous 1.2.4 version.
### Changed
- Changed the path specified in the package.json file to use a relative path instead of a absolute path.
    - For some reason, the absolute path fails, causing users to be unable to use the "jwts" object after installation.
    - The relative path seems to work now, but it is intended as a quick fix for now, as I believe there should be a better way of doing this, and relative path does not seems to be it.
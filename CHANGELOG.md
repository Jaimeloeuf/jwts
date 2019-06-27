# Changelog for "jwts" package
This project follows [Semantic Versioning](https://semver.org/).  
- MAJOR version updates means incompatible API changes,
- MINOR version updates means added functionality or change of implementation in a backwards-compatible manner
- PATCH version means bug fixes or minor updates that are backwards-compatible.

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
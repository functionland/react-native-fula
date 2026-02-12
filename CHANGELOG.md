# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.57.2] - 2026-02-12

### Changed
- Minor detail

## [1.57.1] - 2026-02-12

### Changed
- Minor detail

## [1.57.0] - 2026-02-11

### Changed
- Removed all file operations
- Direct connection to kubo instead of go-fula

## [1.56.2] - 2026-02-08

### Changed
- Better libp2p connection management

## [1.56.1] - 2026-02-07

### Changed
- Better libp2p connection management

## [1.56.0] - 2026-02-07

### Changed
- Better libp2p connection management

## [1.55.16] - 2026-02-05

### Changed
- Updated Docker APIs

## [1.55.15] - 2025-01-22

### Changed
- **BREAKING**: Updated iOS deployment target to iOS 15.0 to ensure compatibility with iOS 18 SDK requirement
- **BREAKING**: Updated Android target SDK to API level 35 (Android 15) to comply with Google Play requirements
- Updated Android compile SDK to API level 35
- Updated Android Gradle Plugin to version 8.7.3 for better compatibility with API level 35
- Updated iOS deployment target from 8.0 to 15.0 in Xcode project settings

### Added
- Added `joinPoolWithChain` method for joining pools on specific blockchain networks
- Added `leavePoolWithChain` method for leaving pools on specific blockchain networks
- Added comprehensive input validation and error handling for new chain-specific methods
- Added example usage for new chain-specific pool methods in example app

### Technical Details
- **iOS**: Apps using this library will now be compatible with Apple's requirement for iOS 18 SDK (Xcode 16+)
- **Android**: Apps using this library will now be compliant with Google Play's requirement for targeting Android 15 (API level 35)
- The deadline for Android compliance is August 30, 2025
- All existing functionality remains unchanged, only the platform targets have been updated

## [1.55.14] - 2025-01-22 (Android Only Update)
- Updated Android target SDK to API level 35 (Android 15)
- Added `joinPoolWithChain` and `leavePoolWithChain` methods

## [1.55.13] - Previous Release
- Previous functionality and features

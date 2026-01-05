# Changelog

All notable changes to the "file-stats" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-05

### Added
- Initial release
- Display file size in status bar
- Detailed information panel with comprehensive statistics
- Support for gzip and brotli compression size calculation
- Line count, character count, and word count metrics
- Customizable status bar format with template variables
- Copy statistics to clipboard command
- Auto-refresh on file changes with debouncing
- Configurable display position (left/right status bar)
- Support for decimal (SI) and binary (IEC) size units
- 12-hour and 24-hour time format options
- File metadata display (created/modified dates, MIME type)
- Modern TypeScript implementation
- Comprehensive configuration options
- Keyboard shortcuts for quick access
- Performance optimizations for large files

### Features
- Real-time file statistics display
- Detailed view with table format
- Compression analysis (gzip/brotli)
- Text metrics (lines, characters, words)
- Custom status bar templates
- One-click copy to clipboard
- Auto-refresh capability
- Flexible configuration

### Technical
- TypeScript 5.3+
- VS Code API 1.75+
- Webpack bundling
- ESLint + Prettier
- Modular architecture

## [Unreleased]

### Planned
- Historical file size tracking
- File size trends visualization
- Comparison with other files
- Custom output formats (JSON, CSV, etc.)
- Integration with Git to show size changes
- Performance profiling for build optimization
- Multi-file statistics aggregation
- Folder size calculation
- Remote file support
- Custom metrics extensibility

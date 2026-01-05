# Changelog

All notable changes to the "file-stats" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Display file size in status bar
- Interactive statistics panel with QuickPick menu
- Webview panel for detailed statistics
- Support for gzip and brotli compression size calculation
- Line count, character count, and word count metrics
- Customizable status bar format with template variables
- Copy statistics to clipboard command
- Auto-refresh on file changes with debouncing
- Configurable display position (left/right status bar) with instant update
- Support for decimal (SI) and binary (IEC) size units
- 12-hour and 24-hour time format options
- File metadata display (created/modified dates, MIME type)
- Modern TypeScript implementation
- Comprehensive configuration options
- ISO 8601 timestamp format for logging
- Unified Output Channel logging system

### Features
- Real-time file statistics display
- Hover tooltip with detailed information
- QuickPick menu for actions (View Details, Refresh, Copy)
- Interactive Webview panel
- Compression analysis (gzip/brotli)
- Text metrics (lines, characters, words)
- Custom status bar templates
- One-click copy to clipboard
- Auto-refresh capability
- Flexible configuration
- Smart filtering (only shows on file documents)

### Technical
- TypeScript 5.3+
- VS Code API 1.75+
- Webpack bundling with production optimization
- ESLint + Prettier
- Modular architecture (Providers, Managers, Views)
- Dependency injection for logging
- Resource cleanup and disposal

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

# Changelog

All notable changes to the "file-stats" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-01-05

### Added

- Added donation support section with WeChat Pay QR code in README

## [1.1.0] - 2026-01-05

### Fixed

- Fixed Codicons not loading in published extension by adding webpack copy plugin
  - Configured CopyWebpackPlugin to bundle codicons static assets (CSS, fonts) into dist directory
  - Updated webview to reference bundled codicons from dist/codicons/ path
  - Resolved "Failed to load resource: 404" error for codicon.css in production builds

## [1.0.9] - 2026-01-05

### Changed

- **Webview UI Enhancement**: Replaced emoji icons with VS Code native Codicons for better visual consistency
  - Copy button: Now uses `codicon-copy` icon
  - Refresh button: Now uses `codicon-refresh` icon
  - Close button: Now uses `codicon-close` icon
- Modernized button design with cleaner flat style
- Improved button hover effects with better visual feedback
- Added `@vscode/codicons` dependency for native icon support

### Improved

- Better integration with VS Code's native UI theme
- More professional and consistent appearance
- Enhanced user experience with clearer, more intuitive icons

## [1.0.8] - 2026-01-05

### Fixed

- Fixed Webview panel memory leak by properly managing event listener disposables
- Event listeners now correctly cleaned up when panel is disposed

### Changed

- Refactored common utility functions to dedicated `formatUtils.ts` module
- Extracted file name extraction logic to `getFileNameFromPath()`
- Extracted date formatting logic to `formatDate()`
- Extracted log timestamp formatting to `formatLogTimestamp()`
- Extracted word counting logic to `countWords()`

### Improved

- Better code organization and maintainability
- Reduced code duplication across multiple files
- Improved memory management in Webview provider

## [1.0.6] - 2026-01-05

### Fixed

- Massive package size reduction: 12+ MB → 30 KB (99.75% reduction)

## [1.0.4] - 2026-01-05

### Changed

- Fixed logging timestamp to use local timezone instead of UTC
- Improved timestamp format readability (YYYY-MM-DD HH:MM:SS)

## [1.0.2] - 2026-01-05

### Changed

- Optimized extension icon size from 1024x1024 to 128x128 pixels (reduced file size from 325KB to 7.7KB)
- Removed emoji from README.md for more professional appearance
- Removed incorrect keyboard shortcut reference from documentation

## [1.0.0] - 2026-01-05

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

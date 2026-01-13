# Changelog

## 1.4.1 (2026-01-13)

### Configure `extensionKind` property

## 1.4.0 (2026-01-12)

🌐 **Virtual Workspace Support**

### New Features
- **Full virtual workspace support**: Now works with GitHub Repositories extension, VS Code for Web, and other virtual file systems
- Supports all URI schemes (not limited to `file:` scheme)
- Compatible with remote development environments

### Technical Changes
- Migrated from Node.js `fs` module to `vscode.workspace.fs` API for file system operations
- Removed hardcoded `uri.scheme !== 'file'` checks
- Updated to use `node:zlib` and `node:util` imports (Node.js built-in module convention)
- Fixed TypeScript strict mode compliance
- Added `capabilities.virtualWorkspaces: true` to package.json

### Compatibility
- Works with local files (unchanged behavior)
- Works with GitHub Repositories (e.g., `vscode-vfs://github/...`)
- Works in VS Code for Web (browser-based)
- Works with any file system provider extension

---

## 1.3.1 (2026-01-08)

🧠 **Smart Text Detection**

### Improvements
- **Intelligent file type detection**: Now automatically detects binary vs text files by analyzing actual file content instead of relying on hardcoded extension list
- More accurate text metrics for files with uncommon extensions (`.log`, `.ini`, `.conf`, `.env`, etc.)
- Improved robustness - supports text files regardless of file extension

### Technical Changes
- Replaced extension-based text detection with intelligent binary content analysis
- Analyzes first 1KB of file content to detect non-printable characters
- Threshold-based detection (if >10% non-printable characters → binary file)
- Supports any text file format automatically

---

## 1.3.0 (2026-01-08)

🚀 **Major Refactoring: Virtual Document Provider**

### Breaking Changes
- Replaced Webview panel with clean Markdown document for statistics display
- Removed "Refresh Statistics" option from QuickPick menu (statistics auto-refresh already available)

### Improvements
- ✨ Simpler, cleaner architecture using VS Code's Virtual Document Provider
- 📝 Statistics displayed in native markdown format with emoji icons and table layout
- 🎨 Opens in Markdown preview mode (side-by-side view) for better visual presentation
- 🖼️ **NEW**: Support for Custom Editors - now shows file statistics for images, PDFs, and other files opened with custom editors
- 🎯 Better integration with VS Code's native UI/UX
- 📦 Smaller package size: removed webview dependencies (@vscode/codicons, copy-webpack-plugin)
- ⚡ Better performance: no HTML rendering overhead
- 🔧 Cleaner codebase: removed statsWebviewProvider.ts and views directory

### Technical Changes
- Created new `StatsDocumentProvider` using `TextDocumentContentProvider` API
- Added `getStatsForUri()` method to support files without TextEditor
- Added tab change listener to detect Custom Editor activations
- Enhanced MIME type detection with 40+ file extensions
- Simplified webpack configuration (removed CopyWebpackPlugin)
- Updated all documentation and instructions
- Optimized compression calculation (skip for large/binary files)

### Migration Note
Users upgrading from previous versions will notice:
- Statistics panel now opens as a markdown document (instead of webview)
- QuickPick menu has 2 options instead of 3 (removed refresh option)
- All other functionality remains the same

## 1.2.1 (2026-01-08)

🎯 **Major Package Size Optimization**

- Reduced package size by 99.3% (11 MB → 82 KB)
- Removed unnecessary Python virtual environment (~10 MB, 848 files)
- Optimized codicons resources (only include required .css and .ttf)
- Removed development resources and documentation from package
- Faster download and installation experience
- No functionality impact - all features work perfectly

## 1.2.0 (2026-01-08)

✨ **New Icon Design**

- Completely redesigned extension icon with fresh, modern look
- Clean light blue background for better visibility
- Document + data chart style clearly shows functionality

## 1.1.1 (2026-01-05)

- Added WeChat donation support

## 1.1.0 (2026-01-05)

- Fixed icons not displaying in published version

## 1.0.9 (2026-01-05)

- Replaced emoji with VS Code native icons
- More professional interface

## 1.0.8 (2026-01-05)

- Fixed memory leak
- Code structure improvements

## 1.0.6 (2026-01-05)

- Reduced package size by 99.75%

## 1.0.4 (2026-01-05)

- Changed log timestamps to local timezone

## 1.0.2 (2026-01-05)

- Optimized icon size to reduce file size

## 1.0.0 (2026-01-05)

🎉 **Initial Release**

**Core Features:**

- 📊 File size display in status bar
- 📋 Click to view detailed statistics
- 🗜️ Gzip/Brotli compression analysis
- 📝 Line, character, and word counts
- ⚙️ Rich customization options

**Highlights:**

- Real-time auto-updates
- One-click copy statistics
- Custom display format support
- SI/IEC unit switching
- Dark theme optimized

# File Stats

Enhanced file statistics display for Visual Studio Code. Shows file size, line count, character count, compression information, and more in the status bar.

## Features

- **Real-time Statistics**: Displays file size and statistics in the status bar
- **Interactive Menu**: Click status bar to access QuickPick menu with actions
- **Markdown Panel**: View statistics in a clean markdown document
- **Compression Info**: Shows gzip and brotli compressed sizes
- **Text Metrics**: Line count, character count, and word count
- **Customizable**: Flexible configuration options
- **Custom Format**: Customize status bar display format
- **Copy Stats**: One-click copy statistics to clipboard
- **Auto-refresh**: Automatically updates when files change
- **Hover Tooltip**: View detailed stats without clicking
- **Position Control**: Display on left or right side of status bar (instant update)
- **Logging**: Comprehensive logging with ISO 8601 timestamps

## Donation

If you find this extension helpful, consider supporting the development:

![WeChat Pay](resources/wechat-pay.jpg)

## Screenshots

### Status Bar Display
The extension displays file information directly in the status bar:
```
15.2 KB
```

### Detailed Information Panel
Click the status bar item to view detailed statistics:
```
======================================================================
File: /path/to/your/file.js
======================================================================

Size                 : 15.2 KB
Size (bytes)         : 15,584
Gzipped              : 4.3 KB
Lines                : 342
Characters           : 15,584
Words                : 2,456
MIME Type            : application/javascript
Created              : 2026-01-05 10:30:45
Modified             : 2026-01-05 14:22:13
======================================================================
```

## Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install file-stats`
4. Press Enter

Or search for "File Stats" in the Extensions view (`Ctrl+Shift+X`).

## Usage

### Status Bar

The extension automatically displays file statistics in the status bar when you open a file.

**Click the status bar** to open a QuickPick menu with the following options:
- **Open Statistics Panel** - View detailed stats in a markdown document
- **Copy Statistics to Clipboard** - Copy stats as JSON format

**Hover over the status bar** to see a tooltip with detailed information including:
- File size (raw and formatted)
- Line count, character count, word count
- Gzip and Brotli compressed sizes (if enabled)
- File type and modification time

### Commands

Access these commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **File Stats: Open Statistics Panel** - Show statistics in a markdown document
- **File Stats: Show Actions Menu** - Show QuickPick menu
- **File Stats: Refresh Statistics** - Manually refresh the statistics
- **File Stats: Copy Statistics to Clipboard** - Copy stats as JSON

## Configuration

Configure the extension in VS Code settings (`Ctrl+,` / `Cmd+,`):

### Display Options

```jsonc
{
  // Status bar position (left or right)
  "fileStats.displayPosition": "left",

  // Custom status bar format
  // Available variables: ${size}, ${lines}, ${chars}, ${words}
  "fileStats.statusBarFormat": "${size} | ${lines} lines",

  // Show info on right side of status bar
  "fileStats.displayInfoOnTheRightSideOfStatusBar": false
}
```

### Size Display

```jsonc
{
  // Use decimal (SI) units instead of binary (IEC) units
  // true: KB = 1000 bytes, false: KiB = 1024 bytes
  "fileStats.useDecimal": false,

  // Show raw size in bytes in detailed view
  "fileStats.showRawInBytes": true
}
```

### Compression

```jsonc
{
  // Show gzip compressed size in detailed view
  "fileStats.showGzip": true,

  // Show gzip size in status bar
  "fileStats.showGzipInStatusBar": false,

  // Show brotli compressed size in detailed view
  "fileStats.showBrotli": false,

  // Show brotli size in status bar
  "fileStats.showBrotliInStatusBar": false
}
```

### Text Statistics

```jsonc
{
  // Show line count in detailed view
  "fileStats.showLineCount": true,

  // Show character count in detailed view
  "fileStats.showCharCount": true,

  // Show word count in detailed view
  "fileStats.showWordCount": true
}
```

### Time Format

```jsonc
{
  // Use 24-hour format for time display
  "fileStats.use24HourFormat": true
}
```

### Auto-refresh

```jsonc
{
  // Automatically refresh stats when file changes
  "fileStats.autoRefresh": true
}
```

## Improvements Over vscode-filesize

This extension is inspired by [vscode-filesize](https://github.com/mkxml/vscode-filesize) but includes several enhancements:

### Modern TypeScript Implementation

- Full TypeScript rewrite with strong typing
- Better code organization and maintainability
- Improved error handling

### Enhanced Features

- **Line count, character count, word count** - Additional text metrics
- **Custom status bar format** - Flexible display template
- **Copy to clipboard** - Export statistics easily
- **Debounced auto-refresh** - Performance optimization for large files
- **More MIME types** - Better language detection

### Improved UX

- More intuitive configuration options
- Better error messages
- Cleaner detailed view layout

## Development

### Setup

```bash
cd /home/wbw/workspace/file-stats
pnpm install
```

### Build

```bash
# Development build
pnpm run compile

# Watch mode
pnpm run watch

# Production build
pnpm run package
```

### Testing

```bash
# Run tests
pnpm run test

# Lint
pnpm run lint

# Format code
pnpm run format
```

### Debugging

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new VS Code window will open with the extension loaded

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Inspired by [vscode-filesize](https://github.com/mkxml/vscode-filesize) by Matheus Kautzmann

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/your-username/file-stats/issues).

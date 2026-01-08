# File Stats - AI Coding Agent Instructions

## Project Overview

**File Stats** is a VS Code extension that displays real-time file statistics (size, compression, text metrics) in the status bar with interactive QuickPick menu and markdown document panel.

- **Language**: TypeScript 5.3+ (strict mode)
- **VS Code API**: 1.75.0+
- **Build System**: Webpack (production bundling)
- **Package Manager**: pnpm
- **Publisher**: WangBowen (marketplace ID: `WangBowen.file-stats`)

## Architecture

### 3-Tier Modular Design

```
src/
├── extension.ts              # Entry point, command registration
├── managers/                 # Business logic & orchestration
│   ├── statusBarManager.ts   # Status bar, QuickPick, logging
│   └── configManager.ts      # Configuration management
├── providers/                # Data processing
│   ├── fileStatsProvider.ts  # File statistics calculation
│   └── statsDocumentProvider.ts # Markdown virtual document
└── utils/                    # Utility functions
    └── formatUtils.ts        # Formatting helpers
```

### Key Design Patterns

1. **Dependency Injection**: Logger injected into `FileStatsProvider` via constructor
2. **Separation of Concerns**: Managers (orchestration) → Providers (data) → Virtual Documents (UI)
3. **Disposable Pattern**: All classes implement `vscode.Disposable` for resource cleanup
4. **Configuration Encapsulation**: All settings accessed via `ConfigManager`
5. **Virtual Document Pattern**: Statistics displayed via VS Code's TextDocumentContentProvider

## Core Components

### StatusBarManager (`managers/statusBarManager.ts`)
- **Responsibilities**: Status bar lifecycle, QuickPick menu, logging
- **Dependencies**: ConfigManager, FileStatsProvider, StatsDocumentProvider
- **Key Methods**:
  - `updateForEditor(editor)` - Main entry point for stat updates
  - `showQuickPick()` - Display action menu (View Details, Copy)
  - `showStatsDocument()` - Open markdown statistics document
  - `log(message, level)` - Output Channel logging with ISO 8601 timestamps

### FileStatsProvider (`providers/fileStatsProvider.ts`)
- **Responsibilities**: File system operations, compression analysis, text metrics
- **Key Features**:
  - File size, gzip/brotli compression calculation
  - Line/char/word counting for text files
  - MIME type detection (11 common language types)
- **Dependencies**: ConfigManager, optional logger callback

### ConfigManager (`managers/configManager.ts`)
- **Configuration Interface**: `FileStatsConfig` (13 properties)
- **Key Settings**:
  - Display: `displayPosition` (left/right), `statusBarFormat` (template)
  - Metrics: `showGzip`, `showBrotli`, `showLineCount`, `showCharCount`, `showWordCount`
  - Units: `useDecimal` (SI vs IEC), `use24HourFormat`
- **Methods**: `get<K>(key)`, `getAll()`, `reload()`

### StatsDocumentProvider (`providers/statsDocumentProvider.ts`)
- **Purpose**: Generate markdown content for file statistics as virtual document
- **Features**: Clean markdown layout, emoji icons, file information
- **Integration**: Uses VS Code's TextDocumentContentProvider API
- **Key Methods**:
  - `createUri(filePath)` - Create URI for virtual document
  - `updateStats(stats)` - Update stats and refresh document
  - `provideTextDocumentContent()` - Generate markdown content

## Coding Conventions

### 1. TypeScript Strict Mode
- Enable all strict flags in `tsconfig.json`
- Use explicit types, avoid `any`
- Prefer interfaces over type aliases for object shapes

### 2. Logging Pattern
```typescript
// Inject logger via constructor
constructor(
  configManager: ConfigManager,
  logger?: (message: string, level?: 'info' | 'error') => void
) {
  this.logger = logger;
}

// Use with optional chaining
this.logger?.('Operation completed', 'info');
```

### 3. Status Bar Format Template
```typescript
// Available variables: ${size}, ${lines}, ${chars}, ${words}
// Example: "${size} | ${lines} lines"
const template = config.statusBarFormat;
const formatted = template
  .replace('${size}', stats.prettySize)
  .replace('${lines}', stats.lineCount?.toString() || '')
  // ... etc
```

### 4. Configuration Access
```typescript
// Always use ConfigManager
const config = this.configManager.getAll();
const position = this.configManager.get('displayPosition');
```

### 5. Resource Disposal
```typescript
// All disposables tracked in extension.ts
context.subscriptions.push(
  statusBarManager,
  command1,
  command2
);

// Implement dispose() in all classes
public dispose(): void {
  this.statusBarItem.dispose();
  this.outputChannel.dispose();
  // ... cleanup
}
```

## Build & Publishing Workflows

### Development Commands
```bash
pnpm install              # Install dependencies
pnpm run compile          # TypeScript → JavaScript (dev)
pnpm run watch            # Watch mode for development
pnpm run package          # Production build (webpack)
pnpm run lint             # ESLint check
pnpm run format           # Prettier formatting
```

### Publishing Workflow
```bash
# CRITICAL: Use --no-dependencies flag (pnpm + vsce compatibility)
vsce package --no-dependencies        # Create .vsix package
vsce publish --no-dependencies        # Publish to marketplace

# Or version bump
vsce publish patch --no-dependencies  # 1.0.x
vsce publish minor --no-dependencies  # 1.x.0
vsce publish major --no-dependencies  # x.0.0
```

**Important**: Always use `--no-dependencies` due to pnpm's symlink structure. Webpack bundles all dependencies into `dist/extension.js`.

### Pre-Publish Checklist
1. Update `CHANGELOG.md` with new version entry
2. Update `version` in `package.json`
3. Run `pnpm run package` to verify production build
4. Test locally: `code --install-extension file-stats-*.vsix`
5. Verify icon displays correctly (128x128, cropped transparent borders)
6. Check marketplace preview: `vsce show WangBowen.file-stats`

## Key Files Reference

| File | Purpose | LOC | Key Points |
|------|---------|-----|------------|
| `src/extension.ts` | Entry point | ~100 | Command registration, event subscriptions |
| `src/managers/statusBarManager.ts` | Orchestration | ~300 | QuickPick, document opening, ISO logging |
| `src/providers/fileStatsProvider.ts` | Data processing | ~200 | Compression (gzip/brotli), text metrics |
| `src/providers/statsDocumentProvider.ts` | UI | ~120 | Markdown generation, virtual document |
| `src/managers/configManager.ts` | Config | ~60 | Reactive config loading |
| `package.json` | Manifest | ~150 | 4 commands, 13 settings |
| `webpack.config.js` | Build | ~30 | Targets Node.js, externalizes vscode |

## Common Tasks

### Adding a New Configuration Setting
1. Update `FileStatsConfig` interface in `configManager.ts`
2. Add default value in `loadConfig()` method
3. Add to `package.json` `contributes.configuration.properties`
4. Use via `this.configManager.get('newSetting')`

### Adding a New Command
1. Register in `extension.ts`:
   ```typescript
   const cmd = vscode.commands.registerCommand('file-stats.newCommand', () => {
     statusBarManager.newMethod();
   });
   context.subscriptions.push(cmd);
   ```
2. Add to `package.json` `contributes.commands`
3. Implement method in `StatusBarManager`

### Modifying Status Bar Format
- Update `updateStatusBar()` in `statusBarManager.ts`
- Respect `statusBarFormat` config for custom templates
- Use `${variable}` placeholder syntax

### Extending File Statistics
1. Add property to `FileStats` interface (`providers/fileStatsProvider.ts`)
2. Calculate in `getStatsForDocument()` method
3. Add to markdown generation in `statsDocumentProvider.ts`
4. Update tooltip in `statusBarManager.ts` if needed

## Testing & Debugging

### Manual Testing
1. Press `F5` in VS Code to launch Extension Development Host
2. Open a file in the new window
3. Check status bar for stats display
4. Test QuickPick menu (click status bar)
5. Test markdown panel (select "Open Statistics Panel")

### Output Channel Logging
- All logs go to "File Stats" Output Channel
- ISO 8601 format with local timezone: `2026-01-05T14:22:13+08:00`
- View via: `View → Output → File Stats`

### Common Issues
- **Status bar shows on Settings page**: Add `document.uri.scheme === 'file'` check
- **Copy command fails**: Ensure `getCurrentStats()` is public in providers
- **Icon too small in marketplace**: Crop transparent borders, target 128x128 with centered content
- **vsce package fails**: Use `--no-dependencies` flag

## External Dependencies

- **filesize** (v10.1.0): Human-readable size formatting (SI/IEC units)
- **zlib** (Node.js built-in): gzip/brotli compression
- **vscode** (API v1.75.0+): Status bar, commands, virtual documents, clipboard

## Marketplace Information

- **ID**: `WangBowen.file-stats`
- **URL**: https://marketplace.visualstudio.com/items?itemName=WangBowen.file-stats
- **Category**: Other
- **Keywords**: file, size, filesize, statistics, status bar, info, metrics, performance
- **Current Version**: 1.0.4 (check `package.json` for latest)

## Documentation Files

- `README.md`: User-facing feature documentation
- `CHANGELOG.md`: Version history and release notes
- `PUBLISH.md`: Comprehensive publishing guide (Chinese)
- `PAT_SETUP.md`: Personal Access Token setup for marketplace
- `PUBLISHING_CHECKLIST.md`: Pre-publish verification steps
- `LICENSE`: MIT License

---

**Last Updated**: 2026-01-05
**Maintained By**: WangBowen (@iwangbowen)

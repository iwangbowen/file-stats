import * as vscode from 'vscode';

export interface FileStatsConfig {
    useDecimal: boolean;
    use24HourFormat: boolean;
    showGzip: boolean;
    showBrotli: boolean;
    showRawInBytes: boolean;
    showGzipInStatusBar: boolean;
    showBrotliInStatusBar: boolean;
    displayPosition: 'left' | 'right';
    showLineCount: boolean;
    showCharCount: boolean;
    showWordCount: boolean;
    autoRefresh: boolean;
    statusBarFormat: string;
}

export class ConfigManager implements vscode.Disposable {
    private config: FileStatsConfig;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): FileStatsConfig {
        const configuration = vscode.workspace.getConfiguration('fileStats');

        return {
            useDecimal: configuration.get('useDecimal', false),
            use24HourFormat: configuration.get('use24HourFormat', true),
            showGzip: configuration.get('showGzip', true),
            showBrotli: configuration.get('showBrotli', false),
            showRawInBytes: configuration.get('showRawInBytes', true),
            showGzipInStatusBar: configuration.get('showGzipInStatusBar', false),
            showBrotliInStatusBar: configuration.get('showBrotliInStatusBar', false),
            displayPosition: configuration.get('displayPosition', 'left'),
            showLineCount: configuration.get('showLineCount', true),
            showCharCount: configuration.get('showCharCount', true),
            showWordCount: configuration.get('showWordCount', true),
            autoRefresh: configuration.get('autoRefresh', true),
            statusBarFormat: configuration.get('statusBarFormat', '${size}'),
        };
    }

    public reload(): void {
        this.config = this.loadConfig();
    }

    public get<K extends keyof FileStatsConfig>(key: K): FileStatsConfig[K] {
        return this.config[key];
    }

    public getAll(): FileStatsConfig {
        return { ...this.config };
    }

    public dispose(): void {
        // Cleanup if needed
    }
}

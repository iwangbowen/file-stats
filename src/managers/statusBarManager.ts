import * as vscode from 'vscode';
import { FileStatsProvider, FileStats } from '../providers/fileStatsProvider';
import { ConfigManager } from './configManager';

export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private outputChannel: vscode.OutputChannel;
    private isShowingDetails: boolean = false;
    private fileStatsProvider: FileStatsProvider;
    private configManager: ConfigManager;
    private refreshTimer: NodeJS.Timeout | null = null;

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
        this.fileStatsProvider = new FileStatsProvider(configManager);
        this.outputChannel = vscode.window.createOutputChannel('File Stats');

        const position = configManager.get('displayPosition');
        const alignment = position === 'right'
            ? vscode.StatusBarAlignment.Right
            : vscode.StatusBarAlignment.Left;

        this.statusBarItem = vscode.window.createStatusBarItem(alignment, 100);
        this.statusBarItem.command = 'file-stats.toggleDetailedInfo';
        this.statusBarItem.tooltip = 'File Statistics - Click for details';
    }

    public async updateForEditor(editor: vscode.TextEditor): Promise<void> {
        const document = editor.document;

        if (document.uri.scheme !== 'file') {
            this.hideStatusBar();
            return;
        }

        const stats = await this.fileStatsProvider.getStatsForDocument(document);
        if (stats) {
            this.updateStatusBar(stats);
        } else {
            this.hideStatusBar();
        }
    }

    private updateStatusBar(stats: FileStats): void {
        const config = this.configManager.getAll();
        let text = config.statusBarFormat;

        // Replace template variables
        text = text.replace('${size}', stats.prettySize);
        text = text.replace('${lines}', stats.lineCount?.toString() || '0');
        text = text.replace('${chars}', stats.charCount?.toString() || '0');
        text = text.replace('${words}', stats.wordCount?.toString() || '0');

        // Add compression info if enabled
        if (config.showGzipInStatusBar && stats.gzipSize) {
            text += ` | Gz: ${stats.gzipSize}`;
        }
        if (config.showBrotliInStatusBar && stats.brotliSize) {
            text += ` | Br: ${stats.brotliSize}`;
        }

        this.statusBarItem.text = `$(file) ${text}`;
        this.statusBarItem.show();
    }

    private hideStatusBar(): void {
        this.statusBarItem.hide();
        this.hideDetailedInfo();
    }

    public async toggleDetailedInfo(): Promise<void> {
        if (this.isShowingDetails) {
            this.hideDetailedInfo();
        } else {
            await this.showDetailedInfo();
        }
    }

    private async showDetailedInfo(): Promise<void> {
        const stats = this.fileStatsProvider.getCurrentStats();
        if (!stats) {
            vscode.window.showWarningMessage('No file statistics available');
            return;
        }

        this.outputChannel.clear();
        this.outputChannel.appendLine('='.repeat(70));
        this.outputChannel.appendLine(`File: ${stats.path}`);
        this.outputChannel.appendLine('='.repeat(70));
        this.outputChannel.appendLine('');

        const config = this.configManager.getAll();
        const rows: Array<{ label: string; value: string }> = [];

        // Basic info
        rows.push({ label: 'Size', value: stats.prettySize });

        if (config.showRawInBytes) {
            rows.push({ label: 'Size (bytes)', value: stats.size.toLocaleString() });
        }

        // Compression
        if (config.showGzip && stats.gzipSize) {
            rows.push({ label: 'Gzipped', value: stats.gzipSize });
        }
        if (config.showBrotli && stats.brotliSize) {
            rows.push({ label: 'Brotli', value: stats.brotliSize });
        }

        // Text statistics
        if (config.showLineCount && stats.lineCount !== undefined) {
            rows.push({ label: 'Lines', value: stats.lineCount.toLocaleString() });
        }
        if (config.showCharCount && stats.charCount !== undefined) {
            rows.push({ label: 'Characters', value: stats.charCount.toLocaleString() });
        }
        if (config.showWordCount && stats.wordCount !== undefined) {
            rows.push({ label: 'Words', value: stats.wordCount.toLocaleString() });
        }

        // File metadata
        if (stats.mimeType) {
            rows.push({ label: 'MIME Type', value: stats.mimeType });
        }
        if (stats.prettyCreated) {
            rows.push({ label: 'Created', value: stats.prettyCreated });
        }
        if (stats.prettyModified) {
            rows.push({ label: 'Modified', value: stats.prettyModified });
        }

        // Render table
        this.renderTable(rows);

        this.outputChannel.appendLine('');
        this.outputChannel.appendLine('='.repeat(70));
        this.outputChannel.show(true);
        this.isShowingDetails = true;
    }

    private renderTable(rows: Array<{ label: string; value: string }>): void {
        const labelWidth = 20;
        const valueWidth = 48;

        for (const row of rows) {
            const label = row.label.padEnd(labelWidth);
            const value = row.value.padEnd(valueWidth);
            this.outputChannel.appendLine(`${label} : ${value}`);
        }
    }

    private hideDetailedInfo(): void {
        this.outputChannel.hide();
        this.isShowingDetails = false;
    }

    public async refresh(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await this.updateForEditor(editor);
            if (this.isShowingDetails) {
                await this.showDetailedInfo();
            }
        }
    }

    public scheduleRefresh(delay: number): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        this.refreshTimer = setTimeout(() => {
            this.refresh();
            this.refreshTimer = null;
        }, delay);
    }

    public dispose(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        this.statusBarItem.dispose();
        this.outputChannel.dispose();
        this.fileStatsProvider.dispose();
    }
}

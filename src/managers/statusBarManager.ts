import * as vscode from 'vscode';
import { FileStatsProvider, FileStats } from '../providers/fileStatsProvider';
import { ConfigManager } from './configManager';
import { StatsWebviewProvider } from '../views/statsWebviewProvider';

export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private outputChannel: vscode.OutputChannel;
    private isShowingDetails: boolean = false;
    private fileStatsProvider: FileStatsProvider;
    private configManager: ConfigManager;
    private refreshTimer: NodeJS.Timeout | null = null;
    private webviewProvider: StatsWebviewProvider;

    constructor(configManager: ConfigManager, extensionUri: vscode.Uri) {
        this.configManager = configManager;
        this.fileStatsProvider = new FileStatsProvider(configManager);
        this.outputChannel = vscode.window.createOutputChannel('File Stats');
        this.webviewProvider = new StatsWebviewProvider(extensionUri);

        const position = configManager.get('displayPosition');
        const alignment = position === 'right'
            ? vscode.StatusBarAlignment.Right
            : vscode.StatusBarAlignment.Left;

        this.statusBarItem = vscode.window.createStatusBarItem(alignment, 100);
        this.statusBarItem.command = 'file-stats.showQuickPick';
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

        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = this.createDetailedTooltip(stats);
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

    public async showQuickPick(): Promise<void> {
        const items: vscode.QuickPickItem[] = [
            {
                label: '$(window) Open Statistics Panel',
                description: 'Show interactive statistics panel'
            },
            {
                label: '$(output) View Detailed Info',
                description: 'Show detailed statistics in output panel'
            },
            {
                label: '$(refresh) Refresh Statistics',
                description: 'Refresh current file statistics'
            },
            {
                label: '$(clippy) Copy Statistics to Clipboard',
                description: 'Copy file statistics as JSON'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select an action for file statistics'
        });

        if (selected) {
            switch (selected.label) {
                case '$(window) Open Statistics Panel':
                    await vscode.commands.executeCommand('file-stats.showWebview');
                    break;
                case '$(output) View Detailed Info':
                    await vscode.commands.executeCommand('file-stats.toggleDetailedInfo');
                    break;
                case '$(refresh) Refresh Statistics':
                    await vscode.commands.executeCommand('file-stats.refreshStats');
                    break;
                case '$(clippy) Copy Statistics to Clipboard':
                    await vscode.commands.executeCommand('file-stats.copyStats');
                    break;
            }
        }
    }

    public showWebview(): void {
        const stats = this.fileStatsProvider.getCurrentStats();
        if (stats) {
            this.webviewProvider.show(stats);
        } else {
            vscode.window.showWarningMessage('No file statistics available');
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

    private createDetailedTooltip(stats: FileStats): vscode.MarkdownString {
        const config = this.configManager.getAll();
        const tooltip = new vscode.MarkdownString();
        tooltip.isTrusted = true;

        // Get file name
        const fileName = stats.path.split(/[\\/]/).pop() || stats.path;

        // Add file name
        tooltip.appendMarkdown(`**${fileName}**\n\n`);

        // Basic info
        tooltip.appendMarkdown(`Size: ${stats.prettySize}`);

        if (config.showRawInBytes) {
            tooltip.appendMarkdown(` (${stats.size.toLocaleString()} bytes)`);
        }
        tooltip.appendMarkdown(`\n\n`);

        // Text statistics
        const statsParts: string[] = [];
        if (config.showLineCount && stats.lineCount !== undefined) {
            statsParts.push(`Lines: ${stats.lineCount.toLocaleString()}`);
        }
        if (config.showCharCount && stats.charCount !== undefined) {
            statsParts.push(`Chars: ${stats.charCount.toLocaleString()}`);
        }
        if (config.showWordCount && stats.wordCount !== undefined) {
            statsParts.push(`Words: ${stats.wordCount.toLocaleString()}`);
        }

        if (statsParts.length > 0) {
            tooltip.appendMarkdown(statsParts.join(' | '));
            tooltip.appendMarkdown(`\n\n`);
        }

        // Compression
        const compressionParts: string[] = [];
        if (config.showGzip && stats.gzipSize) {
            compressionParts.push(`Gzip: ${stats.gzipSize}`);
        }
        if (config.showBrotli && stats.brotliSize) {
            compressionParts.push(`Brotli: ${stats.brotliSize}`);
        }

        if (compressionParts.length > 0) {
            tooltip.appendMarkdown(compressionParts.join(' | '));
            tooltip.appendMarkdown(`\n\n`);
        }

        // File metadata
        if (stats.mimeType) {
            tooltip.appendMarkdown(`Type: ${stats.mimeType}\n\n`);
        }
        if (stats.prettyModified) {
            tooltip.appendMarkdown(`Modified: ${stats.prettyModified}`);
        }

        return tooltip;
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
        this.webviewProvider.dispose();
    }
}

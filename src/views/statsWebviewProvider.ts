import * as vscode from 'vscode';
import { FileStats } from '../providers/fileStatsProvider';
import { getFileNameFromPath } from '../utils/formatUtils';

export class StatsWebviewProvider implements vscode.Disposable {
    private panel: vscode.WebviewPanel | undefined;
    private currentStats: FileStats | null = null;
    private readonly disposables: vscode.Disposable[] = [];

    constructor(private readonly extensionUri: vscode.Uri) {}

    public show(stats: FileStats) {
        this.currentStats = stats;

        if (this.panel) {
            // If panel exists, just update and reveal it
            this.panel.webview.html = this.getHtmlContent(stats);
            this.panel.reveal(vscode.ViewColumn.Beside, true);
        } else {
            // Create new panel
            this.panel = vscode.window.createWebviewPanel(
                'fileStats',
                'File Statistics',
                {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                },
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            this.panel.webview.html = this.getHtmlContent(stats);

            // Handle messages from webview and cleanup when panel is closed
            this.disposables.push(
                this.panel.webview.onDidReceiveMessage(
                    message => this.handleMessage(message)
                ),
                this.panel.onDidDispose(
                    () => {
                        this.panel = undefined;
                        // Clear all disposables when panel is disposed
                        this.disposables.forEach(d => d.dispose());
                        this.disposables.length = 0;
                    }
                )
            );
        }
    }

    public hide() {
        if (this.panel) {
            this.panel.dispose();
            this.panel = undefined;
        }
    }

    public isVisible(): boolean {
        return this.panel !== undefined;
    }

    private async handleMessage(message: any) {
        switch (message.command) {
            case 'copy':
                if (this.currentStats) {
                    await vscode.env.clipboard.writeText(JSON.stringify(this.currentStats, null, 2));
                    vscode.window.showInformationMessage('File statistics copied to clipboard');
                }
                break;
            case 'refresh':
                await vscode.commands.executeCommand('file-stats.refreshStats');
                break;
            case 'close':
                this.hide();
                break;
        }
    }

    private getHtmlContent(stats: FileStats): string {
        const fileName = getFileNameFromPath(stats.path);

        // Get Codicon font URI
        const codiconsUri = this.panel?.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Statistics</title>
    <link href="${codiconsUri}" rel="stylesheet" />
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
        }
        .container {
            padding: 16px;
            max-width: 600px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .title {
            font-size: 16px;
            font-weight: 600;
            color: var(--vscode-foreground);
        }
        .actions {
            display: flex;
            gap: 8px;
        }
        .btn {
            background: transparent;
            color: var(--vscode-foreground);
            border: 1px solid var(--vscode-button-border);
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 13px;
            font-weight: 400;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .btn:hover {
            background: var(--vscode-list-hoverBackground);
            border-color: var(--vscode-focusBorder);
        }
        .btn:active {
            transform: translateY(1px);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px 16px;
            margin-bottom: 20px;
        }
        .stat-label {
            font-weight: 500;
            color: var(--vscode-descriptionForeground);
        }
        .stat-value {
            color: var(--vscode-foreground);
            font-family: var(--vscode-editor-font-family);
        }
        .section-title {
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 12px;
            color: var(--vscode-foreground);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .divider {
            height: 1px;
            background: var(--vscode-panel-border);
            margin: 16px 0;
        }
        .file-path {
            font-family: var(--vscode-editor-font-family);
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            word-break: break-all;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <div class="title">${fileName}</div>
                <div class="file-path">${stats.path}</div>
            </div>
            <div class="actions">
                <button class="btn" onclick="copyStats()">
                    <i class="codicon codicon-copy"></i>
                    Copy
                </button>
                <button class="btn" onclick="refreshStats()">
                    <i class="codicon codicon-refresh"></i>
                    Refresh
                </button>
                <button class="btn" onclick="closePanel()">
                    <i class="codicon codicon-close"></i>
                    Close
                </button>
            </div>
        </div>

        <div class="section-title">File Size</div>
        <div class="stats-grid">
            <div class="stat-label">Size:</div>
            <div class="stat-value">${stats.prettySize}</div>

            <div class="stat-label">Bytes:</div>
            <div class="stat-value">${stats.size.toLocaleString()}</div>

            ${stats.gzipSize ? `
            <div class="stat-label">Gzipped:</div>
            <div class="stat-value">${stats.gzipSize}</div>
            ` : ''}

            ${stats.brotliSize ? `
            <div class="stat-label">Brotli:</div>
            <div class="stat-value">${stats.brotliSize}</div>
            ` : ''}
        </div>

        ${stats.lineCount !== undefined || stats.charCount !== undefined || stats.wordCount !== undefined ? `
        <div class="divider"></div>
        <div class="section-title">Content Statistics</div>
        <div class="stats-grid">
            ${stats.lineCount !== undefined ? `
            <div class="stat-label">Lines:</div>
            <div class="stat-value">${stats.lineCount.toLocaleString()}</div>
            ` : ''}

            ${stats.charCount !== undefined ? `
            <div class="stat-label">Characters:</div>
            <div class="stat-value">${stats.charCount.toLocaleString()}</div>
            ` : ''}

            ${stats.wordCount !== undefined ? `
            <div class="stat-label">Words:</div>
            <div class="stat-value">${stats.wordCount.toLocaleString()}</div>
            ` : ''}
        </div>
        ` : ''}

        <div class="divider"></div>
        <div class="section-title">File Information</div>
        <div class="stats-grid">
            ${stats.mimeType ? `
            <div class="stat-label">Type:</div>
            <div class="stat-value">${stats.mimeType}</div>
            ` : ''}

            ${stats.prettyCreated ? `
            <div class="stat-label">Created:</div>
            <div class="stat-value">${stats.prettyCreated}</div>
            ` : ''}

            ${stats.prettyModified ? `
            <div class="stat-label">Modified:</div>
            <div class="stat-value">${stats.prettyModified}</div>
            ` : ''}
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function copyStats() {
            vscode.postMessage({ command: 'copy' });
        }

        function refreshStats() {
            vscode.postMessage({ command: 'refresh' });
        }

        function closePanel() {
            vscode.postMessage({ command: 'close' });
        }
    </script>
</body>
</html>`;
    }

    public dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
        // Dispose all event listeners
        this.disposables.forEach(d => d.dispose());
        this.disposables.length = 0;
    }
}

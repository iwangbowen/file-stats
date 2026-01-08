import * as vscode from 'vscode';
import { FileStats } from './fileStatsProvider';
import { getFileNameFromPath } from '../utils/formatUtils';

/**
 * Virtual document provider that generates markdown content for file statistics
 */
export class StatsDocumentProvider implements vscode.TextDocumentContentProvider {
    private static readonly scheme = 'file-stats';
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private currentStats: FileStats | null = null;

    readonly onDidChange = this._onDidChange.event;

    /**
     * Get the URI scheme for this provider
     */
    public static getScheme(): string {
        return this.scheme;
    }

    /**
     * Create a URI for displaying file statistics
     */
    public static createUri(filePath: string): vscode.Uri {
        const fileName = getFileNameFromPath(filePath);
        return vscode.Uri.parse(`${this.scheme}:${fileName}.md`);
    }

    /**
     * Update the statistics and trigger content refresh
     */
    public updateStats(stats: FileStats): void {
        this.currentStats = stats;
        // Trigger refresh for any open virtual documents
        this._onDidChange.fire(StatsDocumentProvider.createUri(stats.path));
    }

    /**
     * Provide the markdown content for the virtual document
     */
    public provideTextDocumentContent(): string {
        if (!this.currentStats) {
            return '# File Statistics\n\nNo statistics available. Please open a file and try again.';
        }

        return this.generateMarkdown(this.currentStats);
    }

    /**
     * Generate markdown content from file statistics
     */
    private generateMarkdown(stats: FileStats): string {
        const fileName = getFileNameFromPath(stats.path);
        const lines: string[] = [];

        // Title and file path
        lines.push(`# ${fileName}`);
        lines.push('');
        lines.push(`**Path:** \`${stats.path}\``);
        lines.push('');
        lines.push('---');
        lines.push('');

        // File Size Section
        lines.push('## 📊 File Size');
        lines.push('');
        lines.push(`- **Size:** ${stats.prettySize}`);
        lines.push(`- **Bytes:** ${stats.size.toLocaleString()}`);

        if (stats.gzipSize) {
            lines.push(`- **Gzipped:** ${stats.gzipSize}`);
        }
        if (stats.brotliSize) {
            lines.push(`- **Brotli:** ${stats.brotliSize}`);
        }
        lines.push('');

        // Content Statistics Section (if available)
        if (
            stats.lineCount !== undefined ||
            stats.charCount !== undefined ||
            stats.wordCount !== undefined
        ) {
            lines.push('## 📝 Content Statistics');
            lines.push('');

            if (stats.lineCount !== undefined) {
                lines.push(`- **Lines:** ${stats.lineCount.toLocaleString()}`);
            }
            if (stats.charCount !== undefined) {
                lines.push(`- **Characters:** ${stats.charCount.toLocaleString()}`);
            }
            if (stats.wordCount !== undefined) {
                lines.push(`- **Words:** ${stats.wordCount.toLocaleString()}`);
            }
            lines.push('');
        }

        // File Information Section
        lines.push('## ℹ️ File Information');
        lines.push('');

        if (stats.mimeType) {
            lines.push(`- **Type:** ${stats.mimeType}`);
        }
        if (stats.prettyCreated) {
            lines.push(`- **Created:** ${stats.prettyCreated}`);
        }
        if (stats.prettyModified) {
            lines.push(`- **Modified:** ${stats.prettyModified}`);
        }
        lines.push('');

        // Footer with tips
        lines.push('---');
        lines.push('');
        lines.push(
            '> 💡 **Tip:** You can copy the raw JSON statistics using the "Copy Statistics to Clipboard" command.'
        );
        lines.push('');

        return lines.join('\n');
    }

    /**
     * Dispose of resources
     */
    public dispose(): void {
        this._onDidChange.dispose();
    }
}

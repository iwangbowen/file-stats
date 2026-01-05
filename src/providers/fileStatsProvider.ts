import * as vscode from 'vscode';
import * as fs from 'fs';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { filesize } from 'filesize';
import { ConfigManager } from '../managers/configManager';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

export interface FileStats {
    path: string;
    size: number;
    prettySize: string;
    gzipSize?: string;
    brotliSize?: string;
    lineCount?: number;
    charCount?: number;
    wordCount?: number;
    mimeType?: string;
    created?: Date;
    modified?: Date;
    prettyCreated?: string;
    prettyModified?: string;
}

export class FileStatsProvider implements vscode.Disposable {
    private currentStats: FileStats | null = null;
    private configManager: ConfigManager;

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
    }

    public async getStatsForDocument(document: vscode.TextDocument): Promise<FileStats | null> {
        if (document.uri.scheme !== 'file') {
            return null;
        }

        try {
            const filePath = document.uri.fsPath;
            const fileStats = await fs.promises.stat(filePath);
            const content = await fs.promises.readFile(filePath);

            const config = this.configManager.getAll();
            const size = fileStats.size;

            const stats: FileStats = {
                path: filePath,
                size,
                prettySize: this.formatSize(size, config.useDecimal),
                created: fileStats.birthtime,
                modified: fileStats.mtime,
                prettyCreated: this.formatDate(fileStats.birthtime, config.use24HourFormat),
                prettyModified: this.formatDate(fileStats.mtime, config.use24HourFormat)
            };

            // Add compression sizes if enabled
            if (config.showGzip || config.showGzipInStatusBar) {
                try {
                    const gzipped = await gzip(content);
                    stats.gzipSize = this.formatSize(gzipped.length, config.useDecimal);
                } catch (error) {
                    console.error('Error calculating gzip size:', error);
                }
            }

            if (config.showBrotli || config.showBrotliInStatusBar) {
                try {
                    const brotlied = await brotliCompress(content);
                    stats.brotliSize = this.formatSize(brotlied.length, config.useDecimal);
                } catch (error) {
                    console.error('Error calculating brotli size:', error);
                }
            }

            // Add text statistics
            const text = document.getText();
            if (config.showLineCount) {
                stats.lineCount = document.lineCount;
            }

            if (config.showCharCount) {
                stats.charCount = text.length;
            }

            if (config.showWordCount) {
                stats.wordCount = this.countWords(text);
            }

            // Try to determine MIME type
            stats.mimeType = this.getMimeType(document.languageId);

            this.currentStats = stats;
            return stats;
        } catch (error) {
            console.error('Error getting file stats:', error);
            return null;
        }
    }

    public getCurrentStats(): FileStats | null {
        return this.currentStats;
    }

    private formatSize(bytes: number, useDecimal: boolean): string {
        return filesize(bytes, {
            base: useDecimal ? 10 : 2,
            standard: useDecimal ? 'si' : 'iec'
        }) as string;
    }

    private formatDate(date: Date, use24Hour: boolean): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !use24Hour
        };
        return date.toLocaleString(undefined, options);
    }

    private countWords(text: string): number {
        const trimmed = text.trim();
        if (trimmed.length === 0) {
            return 0;
        }
        return trimmed.split(/\s+/).length;
    }

    private getMimeType(languageId: string): string {
        const mimeTypes: Record<string, string> = {
            'javascript': 'application/javascript',
            'typescript': 'application/typescript',
            'json': 'application/json',
            'html': 'text/html',
            'css': 'text/css',
            'markdown': 'text/markdown',
            'python': 'text/x-python',
            'java': 'text/x-java',
            'xml': 'application/xml',
            'yaml': 'application/x-yaml',
            'plaintext': 'text/plain'
        };
        return mimeTypes[languageId] || 'application/octet-stream';
    }

    public dispose(): void {
        this.currentStats = null;
    }
}

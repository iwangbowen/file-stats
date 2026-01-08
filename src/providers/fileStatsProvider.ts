import * as vscode from 'vscode';
import * as fs from 'fs';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { filesize } from 'filesize';
import { ConfigManager } from '../managers/configManager';
import { formatDate, countWords } from '../utils/formatUtils';

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
    private readonly logger?: (message: string, level?: 'info' | 'error') => void;

    constructor(
        configManager: ConfigManager,
        logger?: (message: string, level?: 'info' | 'error') => void
    ) {
        this.configManager = configManager;
        this.logger = logger;
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
                prettyCreated: formatDate(fileStats.birthtime, config.use24HourFormat),
                prettyModified: formatDate(fileStats.mtime, config.use24HourFormat),
            };

            // Add compression sizes if enabled
            if (config.showGzip || config.showGzipInStatusBar) {
                try {
                    const gzipped = await gzip(content);
                    stats.gzipSize = this.formatSize(gzipped.length, config.useDecimal);
                } catch (error) {
                    this.logger?.(`Error calculating gzip size: ${error}`, 'error');
                }
            }

            if (config.showBrotli || config.showBrotliInStatusBar) {
                try {
                    const brotlied = await brotliCompress(content);
                    stats.brotliSize = this.formatSize(brotlied.length, config.useDecimal);
                } catch (error) {
                    this.logger?.(`Error calculating brotli size: ${error}`, 'error');
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
                stats.wordCount = countWords(text);
            }

            // Try to determine MIME type
            stats.mimeType = this.getMimeType(document.languageId);

            this.currentStats = stats;
            return stats;
        } catch (error) {
            this.logger?.(`Error getting file stats: ${error}`, 'error');
            return null;
        }
    }

    public async getStatsForUri(uri: vscode.Uri): Promise<FileStats | null> {
        if (uri.scheme !== 'file') {
            return null;
        }

        try {
            const filePath = uri.fsPath;
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
                prettyCreated: formatDate(fileStats.birthtime, config.use24HourFormat),
                prettyModified: formatDate(fileStats.mtime, config.use24HourFormat),
            };

            // Determine file extension and MIME type
            const ext = filePath.toLowerCase().split('.').pop() || '';
            stats.mimeType = this.getMimeTypeFromExtension(ext);

            // Try to detect if file is text by attempting UTF-8 decoding
            // Skip compression and text stats for very large files (>10MB)
            if (size < 10 * 1024 * 1024) {
                try {
                    const text = content.toString('utf-8');
                    const isText = this.isValidText(text);

                    if (isText) {
                        // Add text statistics
                        if (config.showLineCount) {
                            stats.lineCount = text.split('\n').length;
                        }
                        if (config.showCharCount) {
                            stats.charCount = text.length;
                        }
                        if (config.showWordCount) {
                            stats.wordCount = countWords(text);
                        }

                        // Add compression sizes for text files
                        if (config.showGzip || config.showGzipInStatusBar) {
                            try {
                                const gzipped = await gzip(content);
                                stats.gzipSize = this.formatSize(gzipped.length, config.useDecimal);
                            } catch (error) {
                                this.logger?.(`Error calculating gzip size: ${error}`, 'error');
                            }
                        }

                        if (config.showBrotli || config.showBrotliInStatusBar) {
                            try {
                                const brotlied = await brotliCompress(content);
                                stats.brotliSize = this.formatSize(
                                    brotlied.length,
                                    config.useDecimal
                                );
                            } catch (error) {
                                this.logger?.(`Error calculating brotli size: ${error}`, 'error');
                            }
                        }
                    }
                } catch (error) {
                    // If UTF-8 decoding fails, it's a binary file - skip text stats
                    this.logger?.(`File is binary: ${error}`, 'info');
                }
            }

            this.currentStats = stats;
            return stats;
        } catch (error) {
            this.logger?.(`Error getting file stats: ${error}`, 'error');
            return null;
        }
    }

    /**
     * Check if the decoded string is valid text by looking for common text characteristics
     */
    private isValidText(text: string): boolean {
        // Skip if text is empty
        if (text.length === 0) {
            return false;
        }

        // Count non-printable characters (excluding common whitespace)
        let nonPrintable = 0;
        const sampleSize = Math.min(text.length, 1000); // Sample first 1000 chars

        for (let i = 0; i < sampleSize; i++) {
            const code = text.charCodeAt(i);
            // Allow: tab (9), newline (10), carriage return (13), printable ASCII (32-126), extended ASCII (128+)
            if (
                code !== 9 &&
                code !== 10 &&
                code !== 13 &&
                (code < 32 || (code >= 127 && code < 128))
            ) {
                nonPrintable++;
            }
        }

        // If more than 10% of sampled characters are non-printable, treat as binary
        return nonPrintable / sampleSize < 0.1;
    }

    public getCurrentStats(): FileStats | null {
        return this.currentStats;
    }

    private formatSize(bytes: number, useDecimal: boolean): string {
        return filesize(bytes, {
            base: useDecimal ? 10 : 2,
            standard: useDecimal ? 'si' : 'iec',
        }) as string;
    }

    private getMimeType(languageId: string): string {
        const mimeTypes: Record<string, string> = {
            javascript: 'application/javascript',
            typescript: 'application/typescript',
            json: 'application/json',
            html: 'text/html',
            css: 'text/css',
            markdown: 'text/markdown',
            python: 'text/x-python',
            java: 'text/x-java',
            xml: 'application/xml',
            yaml: 'application/x-yaml',
            plaintext: 'text/plain',
        };
        return mimeTypes[languageId] || 'application/octet-stream';
    }

    private getMimeTypeFromExtension(ext: string): string {
        const mimeTypes: Record<string, string> = {
            // Images
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            bmp: 'image/bmp',
            svg: 'image/svg+xml',
            webp: 'image/webp',
            ico: 'image/x-icon',
            // Text
            txt: 'text/plain',
            md: 'text/markdown',
            html: 'text/html',
            css: 'text/css',
            js: 'application/javascript',
            ts: 'application/typescript',
            jsx: 'application/javascript',
            tsx: 'application/typescript',
            json: 'application/json',
            xml: 'application/xml',
            yaml: 'application/x-yaml',
            yml: 'application/x-yaml',
            // Programming
            py: 'text/x-python',
            java: 'text/x-java',
            c: 'text/x-c',
            cpp: 'text/x-c++',
            h: 'text/x-c',
            cs: 'text/x-csharp',
            go: 'text/x-go',
            rs: 'text/x-rust',
            php: 'text/x-php',
            rb: 'text/x-ruby',
            sh: 'text/x-shellscript',
            // Archives
            zip: 'application/zip',
            tar: 'application/x-tar',
            gz: 'application/gzip',
            '7zip': 'application/x-7z-compressed',
            rar: 'application/x-rar-compressed',
            // Documents
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    public dispose(): void {
        this.currentStats = null;
    }
}

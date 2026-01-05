/**
 * Utility functions for formatting data
 */

/**
 * Extract file name from a full file path
 * @param filePath - Full file path (can use / or \ as separator)
 * @returns File name only
 */
export function getFileNameFromPath(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || filePath;
}

/**
 * Format a date according to user preferences
 * @param date - Date to format
 * @param use24Hour - Whether to use 24-hour format
 * @returns Formatted date string
 */
export function formatDate(date: Date, use24Hour: boolean): string {
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

/**
 * Format a timestamp for logging purposes
 * @param date - Date to format
 * @returns ISO-like formatted timestamp
 */
export function formatLogTimestamp(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Count words in a text string
 * @param text - Text to count words in
 * @returns Number of words
 */
export function countWords(text: string): number {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return 0;
    }
    return trimmed.split(/\s+/).length;
}

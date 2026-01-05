import * as vscode from 'vscode';
import { StatusBarManager } from './managers/statusBarManager';
import { ConfigManager } from './managers/configManager';

let statusBarManager: StatusBarManager;
let configManager: ConfigManager;

export function activate(context: vscode.ExtensionContext) {
    // Initialize managers
    configManager = new ConfigManager();
    statusBarManager = new StatusBarManager(configManager, context.extensionUri);

    const showWebviewCommand = vscode.commands.registerCommand(
        'file-stats.showWebview',
        () => statusBarManager.showWebview()
    );

    const showQuickPickCommand = vscode.commands.registerCommand(
        'file-stats.showQuickPick',
        () => statusBarManager.showQuickPick()
    );

    const refreshCommand = vscode.commands.registerCommand(
        'file-stats.refreshStats',
        () => statusBarManager.refresh()
    );

    const copyStatsCommand = vscode.commands.registerCommand(
        'file-stats.copyStats',
        async () => {
            try {
                const stats = statusBarManager.getCurrentStats();
                if (stats) {
                    const statsText = JSON.stringify(stats, null, 2);
                    await vscode.env.clipboard.writeText(statsText);
                    vscode.window.showInformationMessage('File statistics copied to clipboard');
                    statusBarManager.log('File statistics copied to clipboard');
                } else {
                    vscode.window.showWarningMessage('No file statistics available. Please open a file first.');
                    statusBarManager.log('Failed to copy: No file statistics available');
                }
            } catch (error) {
                vscode.window.showErrorMessage('Failed to copy file statistics');
                statusBarManager.log(`Error copying statistics: ${error}`);
            }
        }
    );

    // Register event listeners
    const onSave = vscode.workspace.onDidSaveTextDocument(() => {
        if (configManager.get('autoRefresh')) {
            statusBarManager.refresh();
        }
    });

    const onActiveEditorChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            statusBarManager.updateForEditor(editor);
        } else {
            // No active text editor (e.g., Settings page, Welcome page)
            statusBarManager.hideStatusBar();
        }
    });

    const onConfigChange = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('fileStats')) {
            configManager.reload();
            const affectsPosition = e.affectsConfiguration('fileStats.displayPosition');
            statusBarManager.handleConfigChange(affectsPosition);
        }
    });

    const onTextChange = vscode.workspace.onDidChangeTextDocument((e) => {
        if (configManager.get('autoRefresh') && e.document === vscode.window.activeTextEditor?.document) {
            // Debounce text changes
            statusBarManager.scheduleRefresh(500);
        }
    });

    // Add to subscriptions
    context.subscriptions.push(
        showWebviewCommand,
        showQuickPickCommand,
        refreshCommand,
        copyStatsCommand,
        onSave,
        onActiveEditorChange,
        onConfigChange,
        onTextChange,
        statusBarManager
    );

    // Initial update
    if (vscode.window.activeTextEditor) {
        statusBarManager.updateForEditor(vscode.window.activeTextEditor);
    }
}

export function deactivate() {
    if (statusBarManager) {
        statusBarManager.log('File Stats extension is now deactivated');
    }
}

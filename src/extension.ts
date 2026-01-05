import * as vscode from 'vscode';
import { FileStatsProvider } from './providers/fileStatsProvider';
import { StatusBarManager } from './managers/statusBarManager';
import { ConfigManager } from './managers/configManager';

let fileStatsProvider: FileStatsProvider;
let statusBarManager: StatusBarManager;
let configManager: ConfigManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('File Stats extension is now active');

    // Initialize managers
    configManager = new ConfigManager();
    statusBarManager = new StatusBarManager(configManager, context.extensionUri);
    fileStatsProvider = new FileStatsProvider(configManager);

    // Register commands
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
            const stats = statusBarManager.getCurrentStats();
            if (stats) {
                await vscode.env.clipboard.writeText(JSON.stringify(stats, null, 2));
                vscode.window.showInformationMessage('File statistics copied to clipboard');
                statusBarManager.log('File statistics copied to clipboard');
            } else {
                vscode.window.showWarningMessage('No file statistics available');
                statusBarManager.log('Failed to copy: No file statistics available');
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
        }
    });

    const onConfigChange = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('fileStats')) {
            configManager.reload();
            statusBarManager.refresh();
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
        statusBarManager,
        fileStatsProvider
    );

    // Initial update
    statusBarManager.log('File Stats extension activated');
    if (vscode.window.activeTextEditor) {
        statusBarManager.updateForEditor(vscode.window.activeTextEditor);
    }
}

export function deactivate() {
    console.log('File Stats extension is now deactivated');
}

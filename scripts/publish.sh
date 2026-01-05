#!/bin/bash

# File Stats Extension发布脚本

set -e  # 遇到错误立即退出

echo "📦 File Stats Extension 发布助手"
echo "================================"
echo ""

# 检查是否安装了vsce
if ! command -v vsce &> /dev/null; then
    echo "❌ 未找到vsce工具"
    echo "📥 正在安装vsce..."
    npm install -g @vscode/vsce
    echo "✅ vsce安装完成"
fi

# 检查当前分支
current_branch=$(git branch --show-current)
echo "🌿 当前分支: $current_branch"

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
    echo "⚠️  检测到未提交的更改:"
    git status -s
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 清理并编译
echo ""
echo "🧹 清理旧文件..."
rm -rf dist/
rm -f *.vsix

echo "🔨 编译生产版本..."
pnpm run package

# 验证编译产物
if [ ! -f "dist/extension.js" ]; then
    echo "❌ 编译失败: dist/extension.js 不存在"
    exit 1
fi
echo "✅ 编译成功"

# 显示将要打包的文件
echo ""
echo "📋 将要打包的文件:"
vsce ls

# 确认
echo ""
read -p "是否继续打包? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# 选择操作
echo ""
echo "请选择操作:"
echo "1) 仅打包 (.vsix)"
echo "2) 打包并发布到市场"
echo "3) 取消"
read -p "选择 (1-3): " -n 1 -r choice
echo

case $choice in
    1)
        echo "📦 正在打包..."
        vsce package
        vsix_file=$(ls -t *.vsix | head -1)
        echo "✅ 打包完成: $vsix_file"
        echo ""
        echo "💡 安装命令:"
        echo "   code --install-extension $vsix_file"
        ;;
    2)
        echo "🚀 正在发布到市场..."

        # 检查是否已登录
        echo "请选择版本升级类型:"
        echo "1) patch (1.0.0 -> 1.0.1)"
        echo "2) minor (1.0.0 -> 1.1.0)"
        echo "3) major (1.0.0 -> 2.0.0)"
        echo "4) 使用当前版本"
        read -p "选择 (1-4): " -n 1 -r version_choice
        echo

        case $version_choice in
            1)
                vsce publish patch
                ;;
            2)
                vsce publish minor
                ;;
            3)
                vsce publish major
                ;;
            4)
                vsce publish
                ;;
            *)
                echo "❌ 无效选择"
                exit 1
                ;;
        esac

        echo "✅ 发布完成!"
        echo ""
        echo "🌐 查看扩展:"
        echo "   https://marketplace.visualstudio.com/items?itemName=iwangbowen.file-stats"
        ;;
    3)
        echo "❌ 已取消"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✨ 完成!"

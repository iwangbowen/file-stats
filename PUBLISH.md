# VS Code扩展发布指南

## 准备工作

### 1. 安装vsce工具
vsce是VS Code扩展的打包和发布工具：

```bash
npm install -g @vscode/vsce
```

### 2. 创建发布者账号

1. 访问 [Azure DevOps](https://dev.azure.com)
2. 使用Microsoft账号登录
3. 创建一个新的组织（如果还没有）
4. 创建Personal Access Token (PAT):
   - 点击右上角用户图标 → User settings → Personal access tokens
   - 点击 "+ New Token"
   - Name: 填写一个描述性名称，如 "VS Code Extension Publishing"
   - Organization: 选择 "All accessible organizations"
   - Expiration: 选择有效期（建议选择较长时间）
   - Scopes: 选择 "Custom defined"
     - 展开 "Marketplace"
     - 勾选 "Acquire" 和 "Manage"
   - 点击 "Create"
   - **重要**: 复制并保存生成的Token，这是唯一一次能看到完整Token的机会

5. 创建发布者账号:
   - 访问 [Visual Studio Marketplace管理页面](https://marketplace.visualstudio.com/manage)
   - 点击 "Create publisher"
   - 填写发布者信息:
     - Name: 发布者ID（必须与package.json中的"publisher"字段一致）
     - Display name: 显示名称
     - Description: 描述

### 3. 登录vsce

```bash
vsce login <your-publisher-name>
```

系统会提示输入Personal Access Token，粘贴之前复制的Token。

## 发布前检查清单

### 1. 检查package.json必填字段

确保以下字段填写完整：

```json
{
  "name": "file-stats",
  "displayName": "File Stats",
  "description": "Enhanced file statistics in VS Code status bar with real-time updates",
  "version": "1.0.0",
  "publisher": "iwangbowen",  // 必须与发布者ID一致
  "icon": "icon.png",          // 扩展图标
  "repository": {
    "type": "git",
    "url": "https://github.com/iwangbowen/file-stats"
  },
  "keywords": [...],           // 搜索关键词
  "license": "MIT",            // 许可证
  "engines": {
    "vscode": "^1.75.0"        // VS Code最低版本要求
  },
  "categories": ["Other"]      // 扩展分类
}
```

### 2. 准备README.md

README.md会显示在扩展市场页面，应包含：

- ✅ 扩展功能介绍
- ✅ 功能截图/动图
- ✅ 安装说明
- ✅ 使用方法
- ✅ 配置说明
- ✅ 已知问题
- ✅ 发布历史
- ✅ 许可证信息

### 3. 准备CHANGELOG.md

记录版本更新历史，格式：

```markdown
# Change Log

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Real-time file statistics in status bar
- Interactive statistics panel
- Gzip and Brotli compression size calculation
- Customizable status bar format
```

### 4. 检查图标文件

- 文件路径: `/home/wbw/workspace/file-stats/icon.png`
- 推荐尺寸: 128x128 像素
- 格式: PNG（支持透明背景）

### 5. 本地测试

确保扩展在本地运行正常：

```bash
# 编译
npm run compile

# 在VS Code中按F5启动调试
# 测试所有功能是否正常工作
```

## 发布步骤

### 方法一：使用vsce命令行（推荐）

1. **打包扩展**（可选，用于测试）:

```bash
vsce package
```

这会生成一个 `.vsix` 文件，可以手动安装测试：
- VS Code → Extensions → ... → Install from VSIX

2. **发布到市场**:

```bash
vsce publish
```

或指定版本号自动升级：

```bash
vsce publish patch  # 1.0.0 -> 1.0.1
vsce publish minor  # 1.0.0 -> 1.1.0
vsce publish major  # 1.0.0 -> 2.0.0
```

### 方法二：Web界面上传

1. 打包扩展:

```bash
vsce package
```

2. 访问 [Marketplace管理页面](https://marketplace.visualstudio.com/manage)

3. 点击你的发布者账号

4. 点击 "New extension" → "Visual Studio Code"

5. 上传生成的 `.vsix` 文件

## 常见问题

### 1. vsce: command not found

解决方法：
```bash
npm install -g @vscode/vsce
```

### 2. Error: Make sure to edit the README.md file before publishing

确保README.md存在且不是默认模板内容。

### 3. Error: Missing publisher name

在package.json中添加 `"publisher"` 字段。

### 4. 图标不显示

- 检查icon路径是否正确
- 确保图标文件包含在发布包中（不在.vscodeignore中）
- 图标格式必须是PNG

### 5. 更新已发布的扩展

```bash
# 修改代码后
vsce publish patch  # 或 minor/major
```

## 发布后

### 1. 验证发布

访问扩展市场页面：
```
https://marketplace.visualstudio.com/items?itemName=<publisher>.<extension-name>
```

例如: `https://marketplace.visualstudio.com/items?itemName=iwangbowen.file-stats`

### 2. 在VS Code中搜索安装

1. 打开VS Code
2. 进入Extensions视图 (Ctrl+Shift+X)
3. 搜索 "File Stats"
4. 点击安装

### 3. 监控和维护

- 查看下载统计
- 回复用户评论和问题
- 根据反馈更新扩展

## .vscodeignore配置

确保不需要的文件不会被打包：

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
!dist/**/*.js
node_modules/**
out/test/**
.github/**
```

## 脚本配置

在package.json中应包含：

```json
{
  "scripts": {
    "vscode:prepublish": "pnpm run package",
    "package": "webpack --mode production --devtool hidden-source-map"
  }
}
```

这样在发布时会自动运行生产构建。

## 首次发布快速步骤

```bash
# 1. 安装工具
npm install -g @vscode/vsce

# 2. 登录（输入PAT）
vsce login iwangbowen

# 3. 检查
vsce ls  # 查看将要打包的文件

# 4. 测试打包
vsce package

# 5. 发布
vsce publish
```

## 后续更新

```bash
# 修改代码后
git add .
git commit -m "描述更新内容"
git push

# 发布新版本
vsce publish patch  # 或 minor/major
```

## 参考资料

- [官方文档: Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce工具文档](https://github.com/microsoft/vscode-vsce)
- [扩展市场管理页面](https://marketplace.visualstudio.com/manage)

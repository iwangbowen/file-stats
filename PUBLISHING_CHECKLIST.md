# 发布前检查清单

在发布到VS Code Marketplace之前，请确保完成以下所有项目：

## 📋 基础信息

- [ ] `package.json`中的`publisher`字段已设置为正确的发布者ID
- [ ] `package.json`中的`version`字段已更新
- [ ] `package.json`中的`description`准确描述了扩展功能
- [ ] `package.json`中的`repository`字段指向正确的Git仓库
- [ ] `package.json`中的`keywords`包含相关搜索关键词
- [ ] `package.json`中的`license`字段已设置

## 📝 文档

- [ ] `README.md`包含完整的功能介绍
- [ ] `README.md`包含清晰的安装和使用说明
- [ ] `README.md`包含配置选项说明
- [ ] `README.md`包含截图或动图演示
- [ ] `CHANGELOG.md`记录了当前版本的所有变更
- [ ] `LICENSE`文件存在且内容正确

## 🎨 视觉元素

- [ ] 扩展图标（`icon.png`）已准备
- [ ] 图标尺寸为128x128像素
- [ ] 图标格式为PNG
- [ ] 图标在浅色和深色主题下都清晰可见

## 🔧 代码质量

- [ ] 代码通过了ESLint检查（`pnpm run lint`）
- [ ] 代码已格式化（`pnpm run format`）
- [ ] TypeScript编译无错误（`pnpm run compile`）
- [ ] 生产构建成功（`pnpm run package`）
- [ ] 已删除所有console.log调试代码（或改为Output Channel）
- [ ] 没有硬编码的敏感信息

## ✅ 功能测试

- [ ] 在VS Code中按F5测试扩展加载正常
- [ ] 所有命令都能正常执行
- [ ] 状态栏显示正常
- [ ] QuickPick菜单工作正常
- [ ] Webview面板显示正常
- [ ] 悬浮提示显示正常
- [ ] 配置项可以正常修改且立即生效
- [ ] Copy功能正常工作
- [ ] Refresh功能正常工作
- [ ] 日志输出到Output Channel正常
- [ ] 在不同文件类型上测试（.js, .ts, .md, .json等）
- [ ] 在大文件上测试性能
- [ ] 在设置页面等非文件页面不显示状态栏

## 📦 打包配置

- [ ] `.vscodeignore`配置正确，不包含源文件
- [ ] `.vscodeignore`不排除dist目录
- [ ] `package.json`的`main`字段指向`./dist/extension.js`
- [ ] `webpack.config.js`配置正确
- [ ] `vscode:prepublish`脚本已配置

## 🔐 发布准备

- [ ] 已在Azure DevOps创建账号
- [ ] 已创建Personal Access Token
- [ ] 已创建发布者账号
- [ ] 发布者ID与package.json中的publisher字段一致
- [ ] 已安装vsce工具（`npm install -g @vscode/vsce`）
- [ ] 已登录vsce（`vsce login <publisher>`）

## 🚀 发布测试

- [ ] 运行`vsce ls`检查打包文件列表
- [ ] 运行`vsce package`成功生成.vsix文件
- [ ] 手动安装.vsix文件测试（`code --install-extension file-stats-*.vsix`）
- [ ] 在新的VS Code窗口中测试已安装的扩展

## 📊 版本管理

- [ ] Git仓库所有更改已提交
- [ ] Git标签已创建（如v1.0.0）
- [ ] 更改已推送到远程仓库
- [ ] GitHub Release已创建（可选）

## 🌐 发布后验证

发布完成后：

- [ ] 在Marketplace搜索扩展名称
- [ ] 检查扩展页面显示正常
- [ ] 图标显示正常
- [ ] README渲染正常
- [ ] 通过VS Code Extensions面板搜索并安装
- [ ] 安装后的扩展工作正常
- [ ] 查看下载和安装统计

## 📞 社区支持

- [ ] GitHub Issues已启用
- [ ] 准备好响应用户反馈
- [ ] 监控扩展评分和评论

## 常见问题

### 打包失败

```bash
# 清理并重新构建
rm -rf dist/ node_modules/
pnpm install
pnpm run package
```

### 发布失败

检查：
1. PAT是否过期
2. 发布者ID是否正确
3. 网络连接是否正常
4. vsce版本是否最新

### 扩展无法加载

检查：
1. `main`字段路径是否正确
2. `activationEvents`是否配置
3. dist/extension.js是否存在
4. webpack构建是否成功

## 快速发布命令

```bash
# 使用发布脚本
./scripts/publish.sh

# 或手动发布
pnpm run package
vsce package
vsce publish
```

## 紧急回滚

如果发现严重问题：

```bash
# 1. 从marketplace下架指定版本
vsce unpublish iwangbowen.file-stats@1.0.0

# 2. 修复问题后重新发布
vsce publish
```

---

**检查完成日期**: ___________

**检查人**: ___________

**备注**: ___________

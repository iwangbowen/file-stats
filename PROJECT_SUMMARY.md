# File Stats - 项目总结

## 📁 项目结构

```
file-stats/
├── .vscode/
│   ├── launch.json              # VS Code 调试配置
│   └── tasks.json               # VS Code 任务配置
├── src/
│   ├── managers/
│   │   ├── configManager.ts     # 配置管理器
│   │   └── statusBarManager.ts  # 状态栏管理器
│   ├── providers/
│   │   └── fileStatsProvider.ts # 文件统计数据提供者
│   └── extension.ts             # 扩展入口文件
├── .eslintrc.json              # ESLint 配置
├── .gitignore                  # Git 忽略文件
├── .prettierrc                 # Prettier 配置
├── .vscodeignore               # 发布时忽略的文件
├── CHANGELOG.md                # 变更日志
├── LICENSE                     # MIT 许可证
├── OPTIMIZATION.md             # 优化建议文档
├── README.md                   # 项目说明文档
├── package.json                # NPM 包配置
├── tsconfig.json               # TypeScript 配置
└── webpack.config.js           # Webpack 构建配置
```

## 🎯 项目亮点

### 1. 核心功能

✅ **基础统计**
- 文件大小显示 (支持 IEC 和 SI 单位)
- 状态栏实时显示
- 点击查看详细信息

✅ **压缩分析**
- Gzip 压缩大小计算
- Brotli 压缩大小计算
- 可选显示在状态栏

✅ **文本统计** (新增)
- 行数统计
- 字符数统计
- 词数统计

✅ **增强功能** (新增)
- 自定义状态栏格式 (模板变量)
- 复制统计数据到剪贴板
- 自动刷新 (带防抖)
- 灵活的显示位置配置

### 2. 技术特性

✅ **现代化技术栈**
- TypeScript 5.3+ (强类型)
- VS Code API 1.75+
- Webpack 5 (模块打包)
- ESLint + Prettier (代码规范)

✅ **架构设计**
- 模块化设计 (Managers, Providers)
- 单一职责原则
- 依赖注入模式
- 完善的资源管理

✅ **性能优化**
- 异步操作不阻塞 UI
- 按需计算统计项
- 防抖处理频繁事件
- 及时释放系统资源

## 🚀 快速开始

### 安装依赖
```bash
cd /home/wbw/workspace/file-stats
pnpm install
```

### 开发调试
```bash
# 编译 TypeScript
pnpm run compile

# 监听模式 (自动重新编译)
pnpm run watch

# 在 VS Code 中按 F5 启动调试
# 会打开一个新的扩展开发窗口
```

### 构建打包
```bash
# 生产环境构建
pnpm run package

# 安装 vsce (VS Code Extension Manager)
pnpm install -g @vscode/vsce

# 打包为 .vsix 文件
vsce package
```

### 本地安装测试
```bash
# 方式1: 通过命令行安装
code --install-extension file-stats-1.0.0.vsix

# 方式2: 在 VS Code 中
# 1. 打开扩展视图 (Ctrl+Shift+X)
# 2. 点击 "..." 菜单
# 3. 选择 "Install from VSIX..."
# 4. 选择打包好的 .vsix 文件
```

## 📊 与原项目对比

| 特性 | vscode-filesize | file-stats | 改进 |
|-----|----------------|------------|-----|
| 语言 | JavaScript | TypeScript | ✅ 类型安全 |
| 架构 | 单文件 | 模块化 | ✅ 可维护性 |
| 文件大小 | ✅ | ✅ | - |
| 压缩统计 | ✅ | ✅ | - |
| 行数统计 | ❌ | ✅ | ✅ 新增 |
| 字符数统计 | ❌ | ✅ | ✅ 新增 |
| 词数统计 | ❌ | ✅ | ✅ 新增 |
| 自定义格式 | ❌ | ✅ | ✅ 新增 |
| 复制功能 | ❌ | ✅ | ✅ 新增 |
| 防抖优化 | ❌ | ✅ | ✅ 性能提升 |
| 配置项 | 7个 | 13个 | ✅ 更灵活 |

## 🎨 使用示例

### 配置示例
```json
{
  // 状态栏显示格式
  "fileStats.statusBarFormat": "${size} | ${lines} lines",

  // 显示位置
  "fileStats.displayPosition": "right",

  // 启用 gzip 显示
  "fileStats.showGzip": true,
  "fileStats.showGzipInStatusBar": true,

  // 启用自动刷新
  "fileStats.autoRefresh": true,

  // 使用十进制单位 (KB 而非 KiB)
  "fileStats.useDecimal": false
}
```

### 快捷键
- `Ctrl+Shift+'` (Windows/Linux) 或 `Cmd+Shift+'` (Mac) - 切换详细信息面板

### 命令面板
1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "File Stats" 查看所有可用命令:
   - File Stats: Toggle Detailed Information
   - File Stats: Refresh Statistics
   - File Stats: Copy Statistics to Clipboard

## 📈 未来规划

### 短期目标 (v1.1)
- [ ] 添加单元测试
- [ ] 支持更多文件格式的 MIME 类型
- [ ] 优化大文件处理性能
- [ ] 添加更多模板变量

### 中期目标 (v1.2)
- [ ] 文件大小历史跟踪
- [ ] 文件夹大小统计
- [ ] Git 集成 (显示相对变化)
- [ ] 导出统计报告

### 长期目标 (v2.0)
- [ ] 图表可视化
- [ ] 多文件对比
- [ ] 自定义指标扩展
- [ ] 团队协作功能

## 🤝 贡献指南

欢迎贡献代码! 请遵循以下步骤:

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 编写
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 添加适当的注释
- 更新相关文档

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

本项目灵感来源于 [vscode-filesize](https://github.com/mkxml/vscode-filesize)，感谢原作者 Matheus Kautzmann 的优秀工作。

## 📞 联系方式

- 项目地址: https://github.com/your-username/file-stats
- Issue 反馈: https://github.com/your-username/file-stats/issues
- 讨论区: https://github.com/your-username/file-stats/discussions

---

**开发者**: File Stats Contributors
**版本**: 1.0.0
**最后更新**: 2026-01-05

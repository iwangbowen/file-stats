# 发布流程

## 标准发布步骤

### 1. 更新版本号

编辑 `package.json`:
```json
{
  "version": "1.0.9"  // 手动修改版本号
}
```

### 2. 更新 CHANGELOG.md

在文件顶部添加新版本记录:
```markdown
## [1.0.9] - 2026-01-XX

### Fixed
- 修复的问题描述

### Added
- 新增的功能描述

### Changed
- 变更的内容描述
```

### 3. 提交代码

```bash
git add package.json CHANGELOG.md
git commit -m "chore: 发布版本 v1.0.9"
git push
```

### 4. 发布到市场

```bash
./publish.sh
```

选择 "打包并发布到市场",脚本会:
- 显示当前版本号
- 要求确认
- 使用 package.json 中的版本号发布 (不会自动升级)

## 版本号规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/):

- **MAJOR (主版本号)**: 不兼容的 API 修改 (例如: 1.0.9 → 2.0.0)
- **MINOR (次版本号)**: 向下兼容的功能性新增 (例如: 1.0.9 → 1.1.0)
- **PATCH (修订号)**: 向下兼容的问题修正 (例如: 1.0.8 → 1.0.9)

## 快速参考

| 场景 | 版本升级 | 示例 |
|------|----------|------|
| Bug 修复 | patch | 1.0.8 → 1.0.9 |
| 新功能 | minor | 1.0.9 → 1.1.0 |
| 重大变更 | major | 1.1.0 → 2.0.0 |

## 重要提示

- ⚠️ **手动管理版本号**: 脚本不会自动升级版本号,避免 package.json 和 CHANGELOG.md 不一致
- ✅ **先更新后发布**: 确保在运行 `publish.sh` 之前已更新两个文件的版本号
- 📝 **保持同步**: package.json 和 CHANGELOG.md 的版本号必须一致

## 相关链接

- [VS Code 扩展发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [语义化版本规范](https://semver.org/lang/zh-CN/)

# Personal Access Token (PAT) 配置指南

## 步骤1: 创建 Azure DevOps 账号

1. 访问 [Azure DevOps](https://dev.azure.com)
2. 使用Microsoft账号登录（或创建新账号）
3. 如果是首次使用，系统会要求创建一个组织

## 步骤2: 创建 Personal Access Token

1. 登录后，点击右上角的用户图标
2. 选择 **User settings** (用户设置)
3. 选择 **Personal access tokens** (个人访问令牌)

   ![Azure DevOps Settings](https://code.visualstudio.com/assets/api/working-with-extensions/publishing-extension/token1.png)

4. 点击 **+ New Token** (新建令牌)

5. 填写令牌信息:
   ```
   Name: VS Code Extension Publishing
   (可以填任何描述性名称)

   Organization: All accessible organizations
   (选择所有组织)

   Expiration (UTC):
   (选择有效期，建议选择较长时间如90天或Custom)

   Scopes:
   - 点击 "Show all scopes" (显示所有范围)
   - 找到 "Marketplace" 部分
   - 勾选:
     ☑ Marketplace (Acquire)
     ☑ Marketplace (Manage)
   ```

6. 点击 **Create** (创建)

7. **重要**: 立即复制生成的Token
   - 这个Token只会显示一次！
   - 如果丢失，只能重新创建
   - 示例格式: `aaaaaa111111bbbbbbb2222222ccccccc333333dddddd444444`

## 步骤3: 创建发布者账号

1. 访问 [Visual Studio Marketplace 管理页面](https://marketplace.visualstudio.com/manage)

2. 如果没有发布者账号，点击 **Create publisher** (创建发布者)

3. 填写发布者信息:
   ```
   Publisher ID*: iwangbowen
   (必须与package.json中的"publisher"字段一致)

   Display name*: 你的显示名称
   (例如: iWangBowen 或 Bowen Wang)

   Description: 关于你的简短描述
   (例如: VS Code Extension Developer)

   Email: 你的电子邮件
   ```

4. 点击 **Create** (创建)

## 步骤4: 使用 Token 登录

在终端中运行:

```bash
vsce login iwangbowen
```

当提示输入 `Personal Access Token` 时：
1. 粘贴之前复制的Token
2. 按Enter

如果看到:
```
The Personal Access Token verification succeeded for the publisher 'iwangbowen'.
```
说明登录成功！

## 步骤5: 发布扩展

现在可以发布了:

```bash
vsce publish --no-dependencies
```

## 常见问题

### Q: 找不到 "Personal access tokens" 选项？

A: 确保：
1. 已登录 https://dev.azure.com
2. 点击右上角用户图标
3. 选择 "User settings" → "Personal access tokens"

### Q: Token创建失败？

A: 检查：
1. 是否有Azure DevOps账号
2. 是否已创建组织
3. 网络连接是否正常

### Q: vsce login失败？

A: 可能原因：
1. Token错误或已过期
2. Publisher ID不匹配
3. Token权限不足（检查是否勾选Marketplace权限）

### Q: 如何查看已创建的Token？

A:
1. 访问 https://dev.azure.com
2. User settings → Personal access tokens
3. 可以看到所有Token列表（但看不到Token内容）
4. 可以Revoke（撤销）或Regenerate（重新生成）

### Q: Token过期了怎么办？

A:
1. 创建新的Token（按照步骤2）
2. 重新登录: `vsce login iwangbowen`
3. 输入新Token

## 安全提示

⚠️ **重要安全事项**:

1. **不要**将Token提交到Git仓库
2. **不要**在公开场合分享Token
3. **不要**在代码中硬编码Token
4. **定期**更换Token
5. Token丢失后**立即**撤销旧Token

## Token存储位置

Token会存储在:
- Linux/Mac: `~/.vsce`
- Windows: `%USERPROFILE%\.vsce`

如果看到警告:
```
WARNING Failed to open credential store.
Falling back to storing secrets clear-text in: /home/user/.vsce
```

这是正常的，Token会以明文方式存储在该文件中。

## 完整流程图

```
1. 创建Azure DevOps账号
   ↓
2. 创建Personal Access Token (PAT)
   (勾选 Marketplace: Acquire & Manage)
   ↓
3. 复制Token (只显示一次!)
   ↓
4. 创建Publisher账号
   (ID必须与package.json中一致)
   ↓
5. 运行 vsce login iwangbowen
   ↓
6. 粘贴Token
   ↓
7. 验证成功！
   ↓
8. 运行 vsce publish --no-dependencies
   ↓
9. 扩展发布到市场 🎉
```

## 下一步

配置完成后：
1. 返回终端
2. 运行 `vsce login iwangbowen`
3. 粘贴Token
4. 运行 `vsce publish --no-dependencies`

发布成功后，你的扩展将在5-10分钟内出现在VS Code Marketplace！

查看扩展页面:
```
https://marketplace.visualstudio.com/items?itemName=iwangbowen.file-stats
```

# 🚀 部署到 Render 指南

## ✅ 已完成的准备工作

- ✅ `package.json` 已添加 `serve` 依赖
- ✅ 已添加 `start` script 用于生产环境

---

## 📋 部署前检查清单

- [ ] 代码可以在本地运行 (`npm run dev`)
- [ ] 测试构建成功 (`npm run build`)
- [ ] 代码已推送到 Git 仓库（GitHub/GitLab）
- [ ] `.env.local` 文件已被 `.gitignore` 忽略（不要提交敏感信息）

---

## 🚀 部署步骤

### 步骤 1：安装新依赖

```bash
npm install
```

### 步骤 2：测试构建

```bash
npm run build
```

如果成功，会在 `dist` 文件夹生成构建文件。

### 步骤 3：推送代码到 Git

```bash
# 添加所有修改
git add .

# 提交更改
git commit -m "Add serve for production deployment"

# 推送到远程仓库
git push
```

### 步骤 4：在 Render 创建 Web Service

1. 访问 [Render Dashboard](https://dashboard.render.com/)
2. 点击 **"New +"** → **"Web Service"**
3. 连接你的 Git 仓库

### 步骤 5：配置 Render 服务

| 配置项 | 值 |
|--------|-----|
| **Name** | `ai-realtime-dashboard` |
| **Region** | `Singapore` 或最近的区域 |
| **Branch** | `main` |
| **Root Directory** | 留空 |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | `Free` |

### 步骤 6：添加环境变量

在 Render 的 **Environment Variables** 部分：

#### 可选（仅当使用 AI 功能时需要）：
```
GEMINI_API_KEY=你的_gemini_api_key
```

**注意**：由于 Firebase 配置目前是硬编码的，不需要添加 Firebase 环境变量。

### 步骤 7：部署

点击 **"Create Web Service"** 按钮，Render 会自动开始部署。

**首次部署时间**：约 3-5 分钟

---

## 🔐 重要：配置 Firebase 授权域名

部署完成后，你会获得一个 URL，例如：
```
https://your-app-name.onrender.com
```

**必须添加到 Firebase 授权域名，否则登录会失败！**

### 配置步骤：

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 `ai-realtime-dashboard`
3. 点击 **Authentication** → **Settings**
4. 找到 **Authorized domains**
5. 点击 **"Add domain"**
6. 输入（不含 `https://`）：
   ```
   your-app-name.onrender.com
   ```
7. 保存

---

## 🧪 测试部署

访问你的 Render URL 并测试：

- [ ] 页面正常加载
- [ ] 登录按钮显示
- [ ] Google 登录功能正常
- [ ] 可以上传 CSV
- [ ] 数据保存到 Firestore

---

## 🔄 更新部署

每次代码更改后，只需：

```bash
git add .
git commit -m "你的更改说明"
git push
```

Render 会自动检测更改并重新部署！

---

## ⚠️ 免费版限制

- 15 分钟无活动会自动休眠
- 休眠后首次访问需要 30-60 秒唤醒
- 每月 750 小时免费运行时间
- 自动提供 HTTPS 证书

---

## 🐛 常见问题

### 构建失败
**检查**：
- 本地 `npm run build` 是否成功
- Render 的 Build Logs 中的错误信息

### 登录失败：unauthorized domain
**解决**：
- 确认已在 Firebase Console 添加 Render 域名

### 页面空白或 404
**检查**：
- Start Command 是否正确：`npm run start`
- `serve` 包是否已安装

### 应用休眠太频繁
**解决方案**：
- 升级到付费计划（$7/月）
- 或使用 UptimeRobot 等服务定期 ping 你的网站

---

## 📞 需要帮助？

部署过程中遇到问题，可以查看：
- [Render 官方文档](https://render.com/docs)
- [Firebase 文档](https://firebase.google.com/docs)

---

## 🎉 部署成功！

恭喜！你的应用现在已经可以在互联网上访问了！

分享你的链接：`https://your-app-name.onrender.com`


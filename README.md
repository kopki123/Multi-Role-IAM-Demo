# Multi-Role IAM Demo (Nuxt 3)

多角色帳號管理系統 Demo。

## 技術棧

- **前端框架**: Nuxt 3 + Vue 3
- **狀態管理**: Pinia
- **UI 框架**: Nuxt UI
- **樣式**: Tailwind CSS
- **資料驗證**: Zod
- **程式碼檢查**: ESLint
- **開發語言**: TypeScript

## 環境需求

- Node.js 18+
- npm

如需環境變數，請複製 `.env.example` 為 `.env` 並依需要調整。

```bash
cp .env.example .env
```

## 安裝相依套件

```bash
npm install
```

## 啟動開發伺服器

啟動後預設服務於 `http://localhost:3000`：

```bash
npm run dev
```

主要頁面：
- 首頁：`/`
- 使用者管理：`/users`

可搜尋、新增、編輯、刪除使用者（皆使用本機 mock API）。

## 生產環境

建置：

```bash
npm run build
```

本地預覽生產版本：

```bash
node .output/server/index.mjs
```

訪問 `http://[::]:3000`
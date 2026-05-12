# PlanHub — Quản Lý Công Việc & Ý Tưởng Cá Nhân

Website quản lý công việc cá nhân và ý tưởng hằng ngày, deploy miễn phí trên GitHub Pages.

## ✨ Tính năng

- 📅 **Lịch công việc** — Xem theo tuần, chia khung Sáng/Chiều/Tối/Phát sinh
- 📊 **Tổng kết tiến độ** — Dashboard thống kê theo tháng và hạng mục
- 💡 **Ý tưởng nhanh** — Lưu ý tưởng dạng card grid, có tìm kiếm & filter tag
- 🔔 **Nhắc nhở** — Tự động hiện task quá hạn và sắp tới

## 🛠 Công nghệ

- React 18 + Vite 5
- React Router v6 (HashRouter)
- Lucide React (icons)
- Vanilla CSS (design system)
- localStorage (lưu dữ liệu trên trình duyệt)

## 🚀 Chạy local

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 📦 Deploy lên GitHub Pages

### Bước 1: Tạo repository trên GitHub

1. Vào [github.com/new](https://github.com/new)
2. Đặt tên repo (ví dụ: `PLAN-DEMO`)
3. Nhấn "Create repository"

### Bước 2: Cập nhật `base` trong `vite.config.js`

Đổi tên repo cho đúng:

```js
export default defineConfig({
  plugins: [react()],
  base: '/TEN-REPO-CUA-BAN/',
})
```

### Bước 3: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/TEN-REPO.git
git push -u origin main
```

### Bước 4: Deploy

```bash
npm run deploy
```

### Bước 5: Bật GitHub Pages

1. Vào **Settings > Pages** trong repo
2. Source: chọn branch `gh-pages`, folder `/(root)`
3. Nhấn Save
4. Truy cập: `https://USERNAME.github.io/TEN-REPO/`

## 📁 Cấu trúc project

```
src/
├── App.jsx              # Router + Layout
├── main.jsx             # Entry point
├── index.css            # Global styles
├── data/
│   ├── storage.js       # localStorage CRUD
│   ├── sampleData.js    # Dữ liệu mẫu
│   └── constants.js     # Constants
├── utils/
│   ├── dateUtils.js     # Date helpers
│   └── helpers.js       # Misc helpers
└── components/
    ├── Layout/          # Sidebar + MainLayout
    ├── Calendar/        # Lịch công việc
    ├── Progress/        # Tổng kết tiến độ
    ├── Reminders/       # Nhắc nhở
    ├── Ideas/           # Ý tưởng nhanh
    └── common/          # Modal, shared components
```

## 🔮 Nâng cấp tương lai

- Kéo thả task giữa các ô
- Dark mode
- Đồng bộ Firebase/Supabase
- Export/Import dữ liệu
- PWA (offline support)
- Notifications API

## 📝 License

MIT

# SETUP.md — Cấu hình hạ tầng & Triển khai

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v3 |
| ORM | Prisma v5 |
| Database (Production) | PostgreSQL 17 — Neon.tech |
| Database (Local backup) | SQLite (`prisma/dev.db`) — không còn dùng chính |
| Hosting | Vercel (Free Hobby tier) |
| Version Control | GitHub |

---

## Git & GitHub

### Repository
- **URL:** https://github.com/phamlong2112/macro-tracking.git
- **Nhánh chính:** `main`

### Cấu hình Git local
```bash
git config user.email "phamlong2112@gmail.com"
git config user.name  "phamlong2112"
```

### .gitignore (các thư mục/file không đưa lên GitHub)
```
node_modules/
.next/
.env
.gemini/
prisma/dev.db
```

### Quy trình làm việc hằng ngày
```bash
# 1. Sửa code trên máy, test tại localhost:3000
npm run dev

# 2. Khi xong một tính năng, commit và push lên GitHub
git add .
git commit -m "mô tả thay đổi"
git push origin main

# → Vercel tự động detect và deploy phiên bản mới (không cần thao tác thêm)
```

---

## Database — Neon PostgreSQL

### Thông tin kết nối
- **Provider:** Neon.tech
- **Version:** PostgreSQL 17
- **Region:** ap-southeast-1 (Singapore)
- **Database:** neondb
- **Host:** ep-patient-mountain-az8we61y.c-3.ap-southeast-1.aws.neon.tech

> ⚠️ **CONNECTION STRING** được lưu trong file `.env` (không được commit lên GitHub).
> Phải thêm thủ công vào Vercel Environment Variables khi deploy lần đầu.

### File .env (ở máy local)
```env
DATABASE_URL="postgresql://neondb_owner:<password>@ep-patient-mountain-az8we61y.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### Lịch sử migration
| Ngày | Migration | Nội dung |
|---|---|---|
| 2026-07-19 | `20260719083339_init` | Khởi tạo toàn bộ schema (PostgreSQL) |

> Migration SQLite cũ (`20260718035739_init`) đã bị xóa khi chuyển sang PostgreSQL.

### Các lệnh database thường dùng
```bash
# Tạo và áp dụng migration mới (khi thay đổi schema)
npx prisma migrate dev --name <ten_thay_doi>

# Áp dụng migration lên production (Neon) — Vercel tự chạy khi deploy
npx prisma migrate deploy

# Nạp dữ liệu mẫu vào database
npx prisma db seed

# Mở Prisma Studio để xem/sửa dữ liệu qua giao diện
npx prisma studio
```

---

## Vercel Deployment

### Cấu hình
- **Project:** macro-tracking
- **GitHub repo:** phamlong2112/macro-tracking
- **Framework Preset:** Next.js (auto-detect)
- **Build Command:** `next build` (mặc định)
- **Auto-deploy:** Bật — mỗi lần push lên nhánh `main` là tự động deploy

### Environment Variables (cài trên Vercel Dashboard)
| Key | Mô tả |
|---|---|
| `DATABASE_URL` | Connection string Neon PostgreSQL (xem file .env) |

### Quy trình deploy lần đầu
1. Vào [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repo `phamlong2112/macro-tracking`
3. Trước khi bấm Deploy: thêm `DATABASE_URL` vào **Environment Variables**
4. Bấm **Deploy** → Vercel tự build và cấp link website

---

## Khi thay đổi Schema Prisma

Mỗi khi sửa file `prisma/schema.prisma` (thêm bảng, thêm cột...), cần làm theo thứ tự:

```bash
# Bước 1: Tạo migration mới và áp dụng lên Neon
npx prisma migrate dev --name <ten_thay_doi>

# Bước 2: Commit toàn bộ thay đổi (bao gồm file migration mới)
git add prisma/
git commit -m "db: <mô tả thay đổi schema>"
git push origin main

# → Vercel khi deploy sẽ tự chạy prisma migrate deploy để đồng bộ production
```

# Hướng dẫn build webapp — cho Antigravity 2.0 (Gemini 3 Pro)

> Tài liệu này là **brief kỹ thuật để đưa cho agent code (Antigravity 2.0)** dựng webapp thật, gồm: database, API CRUD cho chỉ số, frontend theo bản thiết kế đã build, và migrate dữ liệu báo cáo hiện tại vào DB. **Không bao gồm crawler** — phần lấy dữ liệu tự động sẽ làm sau.

**Đầu vào bắt buộc phải đọc trước khi code:**
- `docs/system-spec-v2.md` — spec giao diện: layout 3 mục, dark theme, modal chi tiết chỉ số (5 khối nội dung).
- `docs/data-schema.md` — data contract `WeekReport` gốc + Zod schema tham khảo.
- `docs/dev-plan.md` — quyết định kiến trúc/tech stack ban đầu (Next.js, không tách backend riêng).
- `macro-dashboard.html` — **nguồn dữ liệu thật** cần migrate (TOPICS array trong `<script>`, dữ liệu tra cứu 12/07/2026).
- `theo-doi-chi-so.md` — nguồn nội dung "giải thích chỉ số" (định nghĩa, ngưỡng đèn, kênh P&L) cho từng chỉ số.
- Bản thiết kế frontend đã build (Claude Design) — dùng làm khung UI, gắn dữ liệu thật vào thay vì mock.

---

## 1. Tech stack

| Lớp | Chọn | Lý do |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Giữ nguyên quyết định trong `dev-plan.md` — 1 codebase cho cả UI và API, Route Handlers đóng vai backend, không cần tách service riêng ở quy mô này. |
| Database | **SQLite** (file `prisma/dev.db`) | Ứng dụng nội bộ, 1 người/nhóm nhỏ cập nhật hàng tuần, không cần hạ tầng DB riêng. Đủ cho vài chục chỉ số × lịch sử vài năm. |
| ORM | **Prisma** | Migration có sẵn (`prisma migrate`), seed script có sẵn (`prisma db seed`) — dùng thẳng cho bước migrate dữ liệu. Đổi sang Postgres sau này chỉ cần đổi `provider` trong `schema.prisma`, không đổi code còn lại. |
| API | **Next.js Route Handlers** (`app/api/**/route.ts`) | REST CRUD đơn giản, không cần GraphQL/tRPC cho phạm vi này. |
| Chart | **Chart.js** qua `react-chartjs-2` | Đã chọn trong `dev-plan.md`; đủ cho sparkline, small-multiples, và chart đầy đủ trong modal (line chart + đường ngưỡng `mark`). |
| Style | **Tailwind CSS** + design tokens từ `system-spec-v2.md` (mục 3) | Bản thiết kế đã build nên đã có sẵn màu/spacing — chỉ cần map đúng token, không tạo lại từ đầu. |
| Validate | **Zod** | Validate payload API (tạo/sửa chỉ số) và dữ liệu seed — kế thừa `data-schema.md`. |

**Không dùng:** microservice riêng, message queue, Redis, auth phức tạp (SSO/OAuth) — ngoài phạm vi hiện tại. Nếu cần đăng nhập, dùng 1 passcode/session đơn giản, không xây hệ thống user/role.

---

## 2. Database — schema

Chuẩn hoá từ `WeekReport` (dạng JSON 1 file/tuần) sang quan hệ, để CRUD từng chỉ số độc lập và lưu lịch sử thật (phục vụ chart đầy đủ trong modal — thay cho nội suy giả `expandSeries` hiện tại).

```prisma
// prisma/schema.prisma
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

model Topic {
  id         String   @id            // "fx" | "demand" | "rates" | "trade" | "macro" | "hormuz"
  code       String                  // "A".."F"
  icon       String                  // emoji
  name       String
  sortOrder  Int
  indicators Indicator[]
  news       NewsItem[]
  statuses   TopicWeeklyStatus[]
}

model Indicator {
  id           String   @id @default(cuid())
  topicId      String
  topic        Topic    @relation(fields: [topicId], references: [id])
  category     String   // "core" | "leading" | "context"
  name         String
  scope        String?  // vd "Mỹ–VN" (field `s` trong schema cũ)
  unit         String?
  freq         String   // "Ngày" | "Tuần" | "Tháng" | "Quý" | "Kỳ họp" | "Sự kiện"
  source       String?
  manualEntry  Boolean  @default(false)   // = flag "nhập tay"
  pnlChannel   String?  // chỉ có ở core
  thresholdText String? // diễn giải ngưỡng đèn (khối E trong modal)
  definition   String?  // giải thích chỉ số (khối E) — nguồn: theo-doi-chi-so.md
  markValue    Float?   // ngưỡng vẽ đường nét đứt trên chart (vd 50 cho PMI)
  sortOrder    Int      @default(0)
  observations Observation[]
  movers       Mover[]
}

model Observation {
  id          String   @id @default(cuid())
  indicatorId String
  indicator   Indicator @relation(fields: [indicatorId], references: [id])
  date        DateTime
  value       Float?              // null nếu không áp dụng
  displayValue String?            // giá trị đã format hiển thị, vd "26.268" hoặc "$76,6"
  signal      String              // "green" | "amber" | "red"
  note        String?             // diễn giải biến động tại thời điểm này (khối D)

  @@unique([indicatorId, date])
  @@index([indicatorId, date])
}

model WeeklyReport {
  id          String   @id @default(cuid())
  weekOf      DateTime
  publishDate DateTime
  horizon     String
  status      String   // trạng thái tổng
  thesis      String
  topicStatuses TopicWeeklyStatus[]
  movers      Mover[]
  scenarios   Scenario[]
  calendar    CalendarItem[]
  news        NewsItem[]
}

model TopicWeeklyStatus {
  id             String   @id @default(cuid())
  weeklyReportId String
  weeklyReport   WeeklyReport @relation(fields: [weeklyReportId], references: [id])
  topicId        String
  topic          Topic    @relation(fields: [topicId], references: [id])
  status         String   // pos | cau | risk
  trend          String   // up | down | flat
  driverNote     String?

  @@unique([weeklyReportId, topicId])
}

model Mover {
  id             String   @id @default(cuid())
  weeklyReportId String
  weeklyReport   WeeklyReport @relation(fields: [weeklyReportId], references: [id])
  indicatorId    String?
  indicator      Indicator? @relation(fields: [indicatorId], references: [id])
  name           String
  note           String
  val            String
  dir            String   // up | down
}

model Scenario {
  id             String   @id @default(cuid())
  weeklyReportId String
  weeklyReport   WeeklyReport @relation(fields: [weeklyReportId], references: [id])
  icon           String
  name           String
  level          String   // monitor | caution | trigger
  note           String
}

model CalendarItem {
  id             String   @id @default(cuid())
  weeklyReportId String
  weeklyReport   WeeklyReport @relation(fields: [weeklyReportId], references: [id])
  date           String
  event          String
  highPriority   Boolean
}

model NewsItem {
  id             String   @id @default(cuid())
  weeklyReportId String
  weeklyReport   WeeklyReport @relation(fields: [weeklyReportId], references: [id])
  topicId        String
  topic          Topic    @relation(fields: [topicId], references: [id])
  tone           String   // pos | neg | neu
  text           String
}
```

**Cách suy ra dữ liệu hiển thị từ schema trên (không lưu trùng lặp):**
- Giá trị hiện tại của 1 chỉ số = `Observation` mới nhất theo `date` của `indicatorId` đó.
- So sánh Tuần/Tháng/YTD/YoY (khối C trong modal) = tính bằng cách lấy `Observation` gần nhất với mốc thời gian tương ứng (now − 7 ngày, − 1 tháng, đầu năm, − 1 năm) rồi so với giá trị hiện tại — viết 1 hàm dùng chung `getComparisonPoints(indicatorId, asOfDate)`, không lưu % sẵn trong DB.
- Đếm xanh/vàng/đỏ ở thẻ chủ đề (Mục 01) và donut (Mục 03) = query `Observation` mới nhất của các `Indicator` thuộc topic đó, nhóm theo `category` (core/context), đếm theo `signal`.
- Chart đầy đủ trong modal = toàn bộ `Observation` của 1 `indicatorId`, sắp theo `date`.

---

## 3. API — CRUD cho chỉ số & dữ liệu

Trọng tâm theo đúng yêu cầu: **tạo/sửa/xoá thông tin và dữ liệu của chỉ số**, chưa làm crawler (không có job tự fetch từ nguồn ngoài).

| Method | Route | Việc |
|---|---|---|
| `GET` | `/api/topics` | Danh sách chủ đề |
| `GET` | `/api/indicators?topicId=&category=` | Danh sách chỉ số (lọc theo chủ đề/loại), kèm giá trị mới nhất |
| `GET` | `/api/indicators/:id` | Chi tiết 1 chỉ số + toàn bộ `Observation` (dùng cho modal) |
| `POST` | `/api/indicators` | **Tạo** chỉ số mới (name, topicId, category, freq, definition, thresholdText, pnlChannel, markValue...) |
| `PATCH` | `/api/indicators/:id` | **Sửa** thông tin tĩnh của chỉ số (không phải giá trị theo ngày) |
| `DELETE` | `/api/indicators/:id` | **Xoá** chỉ số (cascade xoá luôn `Observation` liên quan) |
| `GET` | `/api/indicators/:id/observations` | Lịch sử giá trị của 1 chỉ số |
| `POST` | `/api/indicators/:id/observations` | **Tạo** 1 điểm dữ liệu mới (date, value, signal, note) — đây là chỗ nhập số liệu tuần mới |
| `PATCH` | `/api/observations/:obsId` | **Sửa** 1 điểm dữ liệu đã nhập sai |
| `DELETE` | `/api/observations/:obsId` | **Xoá** 1 điểm dữ liệu |
| `GET`/`POST` | `/api/weekly-reports` | Danh sách / tạo kỳ báo cáo mới (meta: weekOf, thesis, status...) |
| `PATCH`/`DELETE` | `/api/weekly-reports/:id` | Sửa/xoá kỳ báo cáo |
| `POST`/`PATCH`/`DELETE` | `/api/weekly-reports/:id/movers`, `/scenarios`, `/calendar`, `/news` | CRUD các khối phụ trợ của 1 kỳ báo cáo |

Validate mọi payload `POST`/`PATCH` bằng Zod schema tương ứng (đặt ở `lib/validation/*.ts`), trả lỗi 400 rõ ràng khi thiếu field bắt buộc.

**Không làm ở bước này:** endpoint `/api/indicators/fetch` hay adapter theo nguồn (FRED, DBnomics...) như đã phác trong `dev-plan.md` mục 4 — để nguyên là việc của giai đoạn crawler sau.

---

## 4. Frontend — gắn vào bản thiết kế đã có

Bản thiết kế (Claude Design) đã dựng theo `system-spec-v2.md` — nhiệm vụ ở đây là **thay dữ liệu cứng (mock) bằng dữ liệu thật từ API**, không thiết kế lại giao diện.

- Trang chính (`app/page.tsx`, Server Component): gọi thẳng Prisma (không qua fetch nội bộ) để lấy dữ liệu tuần mới nhất → render Mục 01/02/03 đúng layout đã thiết kế.
- Modal chi tiết chỉ số (Client Component): khi mở, gọi `GET /api/indicators/:id` lấy `Observation[]` đầy đủ → vẽ chart bằng Chart.js, tính khối so sánh giai đoạn, hiển thị `note` mới nhất (diễn giải biến động) và `definition`/`thresholdText` (giải thích chỉ số) — đúng 5 khối đã mô tả trong `system-spec-v2.md` mục 4.2.
- Giữ nguyên toàn bộ token màu/dark theme đã build — không đổi CSS ngoài việc nối data.
- Nếu bản thiết kế đã build dùng cấu trúc component khác (đặt tên khác), agent cần map lại field cho khớp, **không đổi tên field API để chiều theo UI cũ** — sửa ở lớp mapping (`lib/mappers/*.ts`), giữ API sạch theo schema DB.

---

## 5. Migrate dữ liệu báo cáo hiện tại vào DB

**Nguồn migrate = `macro-dashboard.html`** (dữ liệu thật, tra cứu 12/07/2026, mảng `TOPICS` trong thẻ `<script>`) — **không phải** `data/sample-week.json` (chỉ là dữ liệu mẫu minh hoạ, số liệu không thật).

Các bước:

1. **Trích xuất `TOPICS`** từ `macro-dashboard.html` thành file JS/TS riêng (`scripts/migrate/source-topics.ts`) — copy nguyên mảng, không gõ lại tay để tránh sai số liệu.
2. **Seed Topic**: 6 chủ đề (fx, demand, rates, trade, macro, hormuz) theo đúng `code`/`icon`/`name`/thứ tự đã có.
3. **Seed Indicator**: với mỗi phần tử trong `core[]` và `context[]` của từng topic → tạo 1 `Indicator` (`category` = `"core"` hoặc `"context"`). Map field: `n→name`, `freq→freq`, `src` (nếu không có trong HTML gốc thì để trống, bổ sung sau), `flag==="manual"→manualEntry=true`.
4. **Seed Observation**: dùng `spark` (mảng điểm neo) + `asOf` (ngày gần nhất) để tạo các `Observation` — vì `spark` chỉ là điểm neo thưa (không phải chuỗi ngày thật đầy đủ), **gán ngày lùi dần hợp lý theo `freq`** (vd chỉ số "Ngày" thì lùi mỗi điểm 1 ngày làm việc, "Tháng" thì lùi 1 tháng) và **đánh dấu rõ trong changelog/README là dữ liệu lịch sử ước lượng**, chỉ điểm cuối (`asOf`, `v`) là số thật chính xác. Không dùng lại hàm `expandSeries` nội suy sin giả — chỉ giữ đúng số điểm neo đã có làm `Observation` thật.
5. **Điền `note`** của Observation mới nhất = field `note` gốc trong HTML (đây chính là nội dung khối D "diễn giải biến động" cho tuần hiện tại).
6. **Điền `definition`/`thresholdText`/`pnlChannel`**: đối chiếu tên chỉ số với `theo-doi-chi-so.md` (bảng Core/Leading/Other theo từng chủ đề) — vì tên gọi giữa 2 file không hoàn toàn giống hệt nhau, **agent cần khớp gần đúng theo nghĩa** (vd "USD/VND liên ngân hàng" ↔ "USD/VND liên NH (cách trần ±5%)") và **liệt kê ra danh sách chỉ số không khớp được** để người dùng bổ sung tay, không tự bịa nội dung.
7. **Seed WeeklyReport** 1 bản ghi cho tuần 12/07/2026 (status/thesis lấy từ tiêu đề/ribbon trong HTML), cùng `Mover`/`Scenario`/`CalendarItem`/`NewsItem` tương ứng nếu có trong HTML gốc (news đã có sẵn theo từng topic).
8. Chạy migrate qua `prisma/seed.ts` (`npx prisma db seed`), **không viết migration một lần dùng rồi xoá** — giữ script seed lại được (idempotent, dùng `upsert`) để còn seed lại khi cần.

---

## 6. Kế hoạch thực hiện (step → verify)

1. Scaffold Next.js + TypeScript + Tailwind + Prisma (SQLite) → verify: `npm run dev` chạy trang trắng không lỗi, `npx prisma studio` mở được DB rỗng.
2. Viết `schema.prisma` theo mục 2 → verify: `npx prisma migrate dev` chạy sạch, tạo đúng các bảng.
3. Viết script migrate (mục 5) → verify: sau khi seed, đếm số `Indicator` phải khớp tổng số dòng core+context trong `macro-dashboard.html` (đếm tay để đối chiếu); liệt kê chỉ số chưa khớp `definition`.
4. Viết API CRUD (mục 3) → verify: test từng endpoint bằng REST client — tạo 1 chỉ số mới, sửa, thêm observation, xoá — dữ liệu phản ánh đúng trong Prisma Studio.
5. Gắn frontend đã thiết kế vào dữ liệu thật (mục 4) → verify: trang chính hiển thị đúng 6 chủ đề, đúng số đếm xanh/vàng/đỏ khớp dữ liệu seed; mở modal 1 chỉ số bất kỳ → đủ 5 khối nội dung theo `system-spec-v2.md`.
6. Kiểm tra responsive + dark theme khớp token đã build → verify: so sánh trực quan với bản thiết kế gốc (Claude Design), không lệch màu/spacing.
7. Review cuối: chạy `npx prisma validate`, kiểm tra không còn dữ liệu mock hard-code nào trong component → verify: grep từ khoá cũ (vd "TOPICS =") không còn xuất hiện trong code frontend.

---

## 7. Ngoài phạm vi (nhắc lại)

- Crawler / adapter tự fetch (FRED, DBnomics, EIA...) — đã có khung dự kiến ở `dev-plan.md` mục 4, chưa triển khai.
- Signal engine tự tính đèn theo ngưỡng, alert tự động.
- Xuất PDF, lịch chạy tự động, gửi email/notify.
- Auth/role phức tạp, đa người dùng.

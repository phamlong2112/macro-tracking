# CLAUDE.md — quy ước đồng bộ dữ liệu (Observation)

## Phân biệt "điểm dữ liệu" và "ngày chạy"

`Observation.date` phải là ngày của **điểm dữ liệu thật** (ngày công bố/ngày ghi nhận theo nguồn), **không phải** ngày agent chạy sync/cập nhật hệ thống.

Lỗi đã gặp nhiều lần trong dự án: khi chạy đồng bộ vào một ngày bất kỳ (vd 18/07), nếu một chỉ số chưa có số liệu mới, agent copy nguyên giá trị cũ và tạo thêm một `Observation` mới gắn ngày chạy đó — tạo ra 2 điểm dữ liệu trùng giá trị cho cùng một thực tế, chỉ khác ngày. Hệ quả: sparkline/lịch sử bị nhiễu, và về sau không còn phân biệt được đâu là lần cập nhật thật.

**Quy tắc:**
- Không có số liệu mới ⇒ **không tạo** `Observation` mới. Để nguyên điểm gần nhất đã có, không "chạm" vào nó chỉ vì hôm nay có chạy sync.
- Chỉ tạo `Observation` mới khi có **giá trị mới thật sự** từ nguồn (kỳ điều hành mới, kỳ báo cáo mới, số liệu ngày mới, v.v.), và `date` phải là ngày của kỳ/số liệu đó — không phải ngày hôm nay.
- Nếu 2 `Observation` liền kề của cùng 1 chỉ số có **giá trị giống hệt nhau**, đó gần như chắc chắn là lỗi trùng lặp kiểu trên — xóa điểm muộn hơn, giữ điểm sớm hơn (điểm sớm hơn phản ánh đúng thời điểm giá trị đó *thật sự* đã đúng).
- `latestUpdateDate` hiển thị ở header dashboard = `MAX(Observation.date)` toàn hệ thống — đây là ngày *hệ thống được đồng bộ gần nhất*, khác với ngày của từng điểm dữ liệu riêng lẻ. Badge "MỚI" (`IndicatorRow.tsx`) chỉ nên bật cho chỉ số tần suất Ngày/Tuần/Kỳ 10 ngày có điểm dữ liệu thật trong 7 ngày gần đây — không dùng `latestUpdateDate` để suy ra chỉ số đó "vừa có số liệu mới".

**Trước khi ghi đè một chỉ số khi đồng bộ:** so giá trị mới định ghi với giá trị `Observation` gần nhất hiện có. Nếu giống hệt, không ghi thêm — chỉ ghi khi thật sự khác.

---

## Database & Môi trường

Dự án đã chuyển hoàn toàn từ **SQLite** sang **PostgreSQL 17 trên Neon.tech** (từ 2026-07-19).

- `DATABASE_URL` trong file `.env` trỏ tới Neon PostgreSQL — dùng cho cả local lẫn production.
- File `prisma/dev.db` (SQLite cũ) được giữ lại nhưng không còn được sử dụng.
- Schema: `prisma/schema.prisma` — provider là `postgresql`.
- Khi thay đổi schema, chạy `npx prisma migrate dev --name <tên>` rồi commit file migration mới.
- Chi tiết đầy đủ về hạ tầng xem tại [SETUP.md](./SETUP.md).

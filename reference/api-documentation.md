# Tài liệu API Cập nhật Hệ thống (Macro Dashboard)

Tài liệu này đặc tả các endpoint nội bộ của Next.js dùng để cập nhật thông tin chỉ báo (Indicators) và thêm mới số liệu theo thời gian thực (Observations). Các agent/bot crawler có thể sử dụng các API này để đổ dữ liệu tự động vào hệ thống.

---

## 1. Cập nhật thông tin gốc của Chỉ báo (Indicator)

Cập nhật các thông tin mô tả, định nghĩa, tần suất, và ngưỡng cảnh báo của một chỉ báo cụ thể.

- **Endpoint**: `PATCH /api/indicators/[id]`
- **Content-Type**: `application/json`

### Body Parameters (Tuỳ chọn)

Bạn chỉ cần truyền lên các field muốn cập nhật.

| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `name` | `string` | Tên chỉ báo (VD: "Tỷ giá USD/VND") |
| `freq` | `string` | Tần suất (VD: "Ngày", "Tuần", "Tháng") |
| `unit` | `string` | Đơn vị tính (VD: "%", "Tỷ USD") |
| `thresholdText`| `string` | Giải thích về ngưỡng cảnh báo |
| `definition` | `string` | Định nghĩa chi tiết chỉ báo |
| `pnlChannel` | `string` | Kênh ảnh hưởng tới P&L (Lợi nhuận) |
| `markValue` | `number` | Giá trị mốc (đường kẻ ngang trên biểu đồ) |
| `source` | `string` | Tên miền trang web nguồn dữ liệu, phân tách bằng dấu phẩy nếu nhiều nguồn (VD: `"sbv.gov.vn, vietcombank.com.vn"`) — không phải link bài viết cụ thể |

### Ví dụ Request (cURL)
```bash
curl -X PATCH http://localhost:3000/api/indicators/cmrpucbfu0039123tfxd66b7w \
  -H "Content-Type: application/json" \
  -d '{
    "markValue": 25500,
    "thresholdText": "Nguy hiểm khi vượt ngưỡng 25.500 VND"
  }'
```

---

## 2. Thêm mới / Cập nhật Số liệu (Observation)

API này sử dụng cơ chế **UPSERT** (Cập nhật nếu đã có, Thêm mới nếu chưa có dựa vào khoá chính là `[indicatorId, date]`). Dùng để đẩy số liệu định kỳ hàng ngày/tuần.

- **Endpoint**: `POST /api/indicators/[id]/observations`
- **Content-Type**: `application/json`

### Body Parameters

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `date` | `string` (ISO 8601) | **Có** | Ngày của dữ liệu (VD: `"2026-07-18T00:00:00Z"`) |
| `signal` | `string` | **Có** | Tín hiệu thị trường: `"green"` (Tích cực), `"amber"` (Lưu ý), `"red"` (Tiêu cực) |
| `value` | `number` | Không | Số liệu thô dùng để vẽ biểu đồ (VD: `26268`) |
| `displayValue`| `string` | Không | Giá trị format để hiển thị (VD: `"26.268"`) |
| `note` | `string` | Không | Diễn giải ngắn gọn nguyên nhân biến động của ngày/tuần đó |
| `cmpW` | `string` | Không | So sánh với tuần trước (VD: `"+0,1%"`) |
| `cmpM` | `string` | Không | So sánh với tháng trước (VD: `"-0,2%"`) |
| `cmpYtd` | `string` | Không | So sánh với đầu năm (VD: `"+0,1%"`) |
| `cmpYoy` | `string` | Không | So sánh với cùng kỳ năm trước (VD: `"+0,6%"`) |

### Ví dụ Request (cURL)
```bash
curl -X POST http://localhost:3000/api/indicators/cmrpucbfu0039123tfxd66b7w/observations \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-07-18T00:00:00.000Z",
    "value": 26300,
    "displayValue": "26.300",
    "signal": "red",
    "note": "Tỷ giá tiếp tục leo thang do DXY tăng mạnh.",
    "cmpW": "+0,5%",
    "cmpM": "+1,2%",
    "cmpYtd": "+4,0%",
    "cmpYoy": "+5,5%"
  }'
```

---

> [!TIP]
> **Hướng dẫn cho Crawler/Bot Agent:**
> 1. Đầu tiên, hãy gọi `GET /api/topics` để lấy danh sách toàn bộ các ID của Indicators đang có trong hệ thống.
> 2. Sử dụng các ID thu thập được để loop và gọi API số `2` (POST observations) mỗi khi thu thập được dữ liệu mới.
> 3. Hệ thống sẽ tự động dùng giá trị mới nhất làm thông tin cảnh báo trên màn hình Tổng quan.

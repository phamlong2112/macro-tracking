# Bảng theo dõi chỉ số vĩ mô — bản vắn tắt

> Danh mục chỉ số Wave 1 (6 chủ đề), phân theo **Core / Leading / Other** + ngưỡng đèn, tần suất, nguồn.
> Dùng để theo dõi & tick hàng tuần. Chi tiết + dashboard động: `macro-dashboard-review.html`.
> Ký hiệu đèn: 🔴 báo động · 🟡 cảnh báo · 🟢 bình thường.

---

## ⏱ Lịch theo dõi (theo tần suất)

- **Hàng ngày:** USD/VND · JPY/VND · EUR/VND · USD/JPY · DXY · UST 10Y · VNIBOR O/N · Brent/WTI · VIX · đường cong 10Y–3M
- **Hàng tuần (compile T2):** BDI/cước container · initial jobless claims · foreign flow VN-Index · tin địa chính trị (Hormuz/Iran)
- **Hàng tháng:** CPI (VN/US/JP/EU) · Core PCE · PMI · cán cân TM VN · FDI · tín dụng VN · IIP · GSCPI · dự trữ ngoại hối · lương/ECI
- **Hàng quý:** GDP · họp Fed/ECB/BOJ/SBV · SLOOS · chi tiêu IT (Gartner/IDC) · NPL/CAR · nearshoring
- **Theo sự kiện:** thuế quan (Section 232) · BIS Entity List · can thiệp SBV · leo thang Hormuz/Đài Loan/Biển Đông

---

## 💱 Tỷ giá & Ngoại hối
*Kênh P&L: margin outsourcing (USD/JPY/EUR) · giá vốn thiết bị nhập · chi phí hedge*

**Core**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| USD/VND liên NH (cách trần ±5%) | 🔴 cách trần <1% · 🟡 gần trần | Ngày | SBV · exchangerate.host |
| JPY/VND (cross) | JPY mạnh → DT Nhật quy VND ↑ | Ngày | FRED DEXJPUS · VNAppMob |
| EUR/VND (cross) | EUR mạnh → DT EU quy VND ↑ | Ngày | ECB · VNAppMob |
| USD/JPY, EUR/USD (cơ sở cross) | Quyết định giá trị cross VND | Ngày | FRED DEXJPUS · DEXUSEU |
| DXY (broad USD index) | 🟢 USD yếu → hỗ trợ VND & JPY | Ngày | FRED DTWEXBGS |
| Dự trữ ngoại hối VN | 🔴 dưới 3 tháng NK bình quân (ngưỡng động — ví dụ ~$150B ở mức NK hiện tại ~$50B/tháng; không dùng mốc USD cố định vì NK thay đổi theo thời gian) | Tháng/Quý | SBV · IMF IFS |

**Leading**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Spread VNIBOR O/N − Fed funds | Thu hẹp/âm → áp lực VND | Ngày | SBV · FRED DFF |
| Chênh Fed−BOJ & US10Y−JGB10Y | Thu hẹp mạnh → JPY mạnh, carry unwind | Ngày | FRED |
| Cán cân TM + FDI giải ngân + kiều hối | Nhập siêu / kiều hối↓ → VND yếu (dẫn 1–2 quý) | Tháng/Quý | Hải quan · MPI · SBV |
| Tỷ giá kỳ hạn (FX forward) VND | Forward mất giá > spot → kỳ vọng VND yếu | Ngày | NHTM · Bloomberg |
| Implied vol USD/VND, JPY/USD, EUR/USD | Vol↑ → chi phí hedge↑ | Ngày | CME FX options |

**Other**

| Chỉ số | Ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| VIX (risk-off) | VIX↑ → JPY safe-haven bid → JPY/VND↑ | Ngày | FRED VIXCLS |
| Foreign flow VN-Index | Bán ròng → giảm cung USD nội địa | Ngày/Tuần | HOSE · VNDirect |
| Can thiệp SBV & thoả thuận Việt–Mỹ | Ít công cụ ổn định VND hơn | Sự kiện | SBV |

---

## 🌐 Cầu CNTT & Outsourcing
*Kênh P&L: doanh thu outsourcing JP/US/EU*

**Core**

| Chỉ số | Ngưỡng/ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| Chi tiêu IT toàn cầu (USD, %YoY) | Giảm tốc → DT outsourcing ↓ | Quý | Gartner · IDC |
| Chi tiêu IT theo vùng NA/JP/EU | Theo dõi phân kỳ vùng | Quý | Gartner · IDC |
| Quy mô thị trường IT outsourcing/BPO | Cạnh tranh PH/IN/VN | Quý | KPMG · Statista |

**Leading**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| PMI New Orders & New Export Orders | 🔴 <50 co lại → cầu IT ↓ sau 1–2 tháng | Tháng | ISM · S&P Global |
| Niềm tin DN (Tankan, Ifo) | Niềm tin↑ → đặt hàng IT↑ về sau | Quý/Tháng | BOJ · Ifo |
| Guidance/capex hyperscaler & big-tech | Cắt capex → chuỗi DV IT co lại | Quý | Earnings calls |
| Tăng trưởng nearshoring (%/năm) | 15–20% → rủi ro VN mất thị phần | Quý | ISG · Deloitte |

**Other**

| Chỉ số | Ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| Thất nghiệp & jobless claims Mỹ | Thất nghiệp↑ → ngân sách IT khách↓ | Tuần/Tháng | BLS · DOL |
| % khách yêu cầu AI-augmented | ↑ → phải nâng năng lực hoặc mất khách | Quý | Gartner · McKinsey |
| Sức mạnh USD (DXY) | Ảnh hưởng cạnh tranh giá vs PH/IN | Ngày | ICE · FRED |

---

## 🏦 Lãi suất & Chi phí vốn
*Kênh P&L: chi phí vốn lưu động + ngân sách IT khách hàng*

**Core**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Lãi suất chính sách Fed/BOJ/ECB/SBV | 🔴 Fed >4.0% → cầu IT Mỹ ↓ | Kỳ họp | Fed · BOJ · ECB · SBV |
| Lãi vay ngắn hạn VND & VNIBOR O/N | Chi phí vốn lưu động trực tiếp | Ngày/Tháng | NHTM · SBV |
| Lợi suất 10Y: UST·JGB·Bund·VGB | Chi phí vốn dài hạn & capex IT | Ngày | FRED · HNX |

**Leading**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Độ dốc đường cong 10Y–3M (Mỹ) | 🔴 đảo ngược → suy thoái ~12 tháng sau | Ngày | FRED T10Y3M · NY Fed |
| Fed dot plot & đường OIS ngụ ý | Định hình kỳ vọng cắt/giữ | Kỳ họp | Fed · CME |
| Tiêu chuẩn cho vay (Fed SLOOS) | Thắt chặt → tín dụng↓ sau vài quý | Quý | Fed SLOOS |
| Quy tắc Sahm (thất nghiệp) | 🟡 ≥+0.5đ so đáy 12T → Fed sắp hạ lãi | Tháng | BLS · Sahm |
| Tăng trưởng tín dụng VN vs mục tiêu | Vượt 15% → rủi ro quá nóng/NPL | Tháng | SBV |

**Other**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Tỷ lệ nợ xấu (NPL) hệ thống VN | ↑ → ngân hàng siết cho vay | Quý | SBV · FiinRatings |
| Credit spread & corporate bond spread | Nới rộng → lo sức khoẻ DN | Tuần | NHTM · TCBS |
| % DN có interest coverage <1 | 🔴 ↑ (nhất là BĐS) → tiền đề NPL | Quý/Năm | IMF Art. IV · FiinGroup |

---

## 🚢 Thương mại & Chuỗi cung ứng
*Kênh P&L: giá vốn thiết bị nhập + cầu hạ tầng nội địa (FDI)*

**Core**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Cán cân thương mại VN (tháng + luỹ kế) | 🔴 thâm hụt >$6B/tháng → áp lực VND | Tháng | Hải quan · GSO |
| Thuế 232 (chip/bán dẫn); Mỹ–Trung | 🔴 25% từ 15/1/2026 → giá TB↑, margin↓ | Sự kiện | USTR · BIS |
| FDI đăng ký & giải ngân VN | 🟡 giải ngân −15% YoY → cầu hạ tầng IT↓ | Tháng | Bộ KH&ĐT · FIA |

**Leading**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| PMI New Export Orders | Giảm → kim ngạch XK giảm sau 1–2 tháng | Tháng | S&P Global |
| FDI đăng ký mới (dẫn giải ngân) | Cam kết↓ → vốn thực↓ về sau | Tháng | Bộ KH&ĐT |
| Baltic Dry (BDI) · cước container | 🟡 spike → logistics & giá nhập↑ | Tuần | Baltic · SSE · Drewry |
| Global Supply Chain Pressure (GSCPI) | ↑ → gián đoạn, thiếu hàng, tăng giá | Tháng | NY Fed |
| BIS Entity List / kiểm soát XK chip | Mở rộng → khan chip cao cấp, chậm giao | Sự kiện | BIS |

**Other**

| Chỉ số | Ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| REER Việt Nam | ↑ → xuất khẩu khó cạnh tranh | Tháng | BIS · IMF |
| USD/VND (giá nhập) | VND yếu → giá nhập thiết bị↑ | Ngày | SBV · NHTM |
| Lead time chip / giao hàng | Kéo dài → rủi ro dòng tiền & tồn kho | Quý | SIA · nhà cung cấp |

---

## 📊 Lạm phát & Tăng trưởng vĩ mô
*"Xương sống": chi phối SBV, Fed, cầu nội địa & quốc tế*

**Core**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| CPI VN·US·JP·EU; Core PCE Mỹ | 🔴 CPI VN >5.5% liên tục 2T → SBV tăng lãi | Tháng | GSO · BLS · BEA |
| GDP VN·US·JP·EU (QoQ, YoY) | Mỹ suy giảm → cắt ngân sách IT | Quý | GSO · BEA · Eurostat |
| Thất nghiệp Mỹ/EU/JP/VN; IIP VN | 🟡 Mỹ ↑ 4.4–4.6% → cảnh báo suy thoái | Tháng | BLS · GSO |

**Leading**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| PPI (dẫn CPI) & giá hàng hoá (Brent, FAO) | PPI/dầu↑ → CPI↑ sau 1–2 tháng | Tháng/Ngày | BLS · FAO · Bloomberg |
| Tăng lương / ECI / AHE | Lương > năng suất → LP dịch vụ dai dẳng | Tháng/Quý | BLS |
| Kỳ vọng lạm phát (UMich, breakeven) | 🟡 breakeven >2.5% → Fed hawkish | Ngày/Tháng | UMich · FRED T10YIE |
| OECD CLI · CB LEI · Credit Impulse | Điểm đảo chiều chu kỳ trước 6–9 tháng | Tháng | OECD · Conf. Board |
| Initial Jobless Claims (Mỹ) | 🟡 >300k/tuần → thất nghiệp↑ tháng sau | Tuần | DOL · FRED ICSA |

**Other**

| Chỉ số | Ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| Niềm tin tiêu dùng (CB, UMich) | Giảm → cầu retail/e-com khách↓ | Tháng | Conf. Board |
| CPI VN theo nhóm (xăng, điện, thực phẩm) | Xăng/điện↑ → chi phí vận hành↑ (liên kết Hormuz) | Tháng | GSO |
| M2 & tín dụng VN; năng suất/TFP | Nền tiền tệ & tăng trưởng tiềm năng | Tháng/Năm | SBV · IMF |

---

## 🛢️ Hormuz Blockage — kịch bản sốc (đèn chờ)
*Thường chỉ theo Brent + tin căng thẳng; lên Watch/Alert mới kích hoạt full bảng & ước lượng P&L 3 kịch bản*

**Mức scenario flag:** 🟢 Bình thường (Brent <$85) → 🟡 Watch (Brent $85–100 / căng thẳng) → 🔴 Alert (đóng một phần eo / Brent >$100)

**Core**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Giá dầu Brent & WTI | 🔴 Brent >$100 hoặc +20%/tuần · 🟡 $85–100 | Ngày | EIA RBRTE/RWTC · FRED |
| CPI nhiên liệu VN (xăng, điện) | Xăng/điện↑ → áp lực SBV tăng lãi | Tháng | GSO |
| Cước VLCC & container tuyến Trung Đông | 🟡 tăng gấp đôi → giá nhập thiết bị↑ | Tuần | Baltic · Drewry |

**Leading (kích hoạt sớm)**

| Chỉ số | Ngưỡng đèn | Tần suất | Nguồn |
|---|---|---|---|
| Lưu lượng qua Hormuz / tin Iran–Israel–Mỹ | Đóng một phần → kích hoạt kịch bản | Ngày | EIA · tin |
| Phí bảo hiểm rủi ro chiến tranh (war-risk) | Spike → chi phí & chậm giao hàng | Ngày | Lloyd's List |
| Khí TTF (EU) / LNG châu Á | Spike → lạm phát năng lượng nhập khẩu | Ngày | ICE · EIA |
| VIX & USD/JPY (risk-off) | VIX↑ + JPY mạnh → risk-off toàn cầu | Ngày | FRED VIXCLS · DEXJPUS |

**Other**

| Chỉ số | Ý nghĩa | Tần suất | Nguồn |
|---|---|---|---|
| Lộ trình Fed (higher-for-longer do LP năng lượng) | Fed hoãn cắt → ngân sách IT siết | Kỳ họp | FRED · CME |
| USD/VND (áp lực kép) | Dầu↑ + risk-off → VND yếu | Ngày | SBV |
| Dự trữ ngoại hối VN | SBV bán USD ổn định → dự trữ↓ | Tháng | SBV · IMF IFS |

---

*Nguồn khung: Approach by risks · FX Risk Monitoring Dashboard · Leading Indicators for Macro · WB & IMF Indicators. Ngưỡng đèn là gợi ý — chốt lại bằng số liệu tài chính nội bộ trước khi vận hành.*

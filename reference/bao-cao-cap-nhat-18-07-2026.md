# Báo cáo tra cứu số liệu chỉ số vĩ mô — tới 18/07/2026

## Cách dùng

1. Đảm bảo server Next.js đang chạy ở `localhost:3000` trên máy bạn.
2. Chạy: `node update-indicators.js` (đặt cùng thư mục, hoặc set `MACRO_API_BASE` nếu server chạy ở port khác).
3. Script tự khớp tên chỉ số với DB (`GET /api/indicators`) rồi đẩy observation mới nhất qua `POST /api/indicators/:id/observations`.
4. Xem console log để biết chỉ số nào khớp/không khớp tên trong DB.

## Bối cảnh quan trọng tuần này

Đang có khủng hoảng Eo Hormuz đang diễn ra: Mỹ–Israel không kích Iran từ 28/2/2026, Iran trả đũa bằng tấn công tàu chở dầu và rải thủy lôi. Giữa tháng 7, Iran tấn công thêm 3 tàu chở dầu UAE khiến Mỹ tái áp trừng phạt dầu Iran và không kích trở lại — đẩy Brent tăng vọt +4,5% trong phiên (lên ~88 USD/thùng) và phí bảo hiểm rủi ro chiến tranh tăng 12–40 lần so với trước xung đột. Kịch bản Hormuz trong dashboard nên chuyển sang mức **Alert (đỏ)**.

Đồng thời Fed vừa đảo chiều hawkish tại kỳ họp SEP tháng 6 (dot plot trung vị cuối 2026 nâng lên 3,8%, họp đầu tiên dưới tân Chủ tịch Kevin Warsh), trong khi lạm phát Mỹ/EU/VN đều đang hạ nhiệt tháng 6 nhờ giá năng lượng giảm — nhiều khả năng đảo chiều tăng trở lại trong số liệu tháng 7 do giá dầu đã vọt lên vì xung đột.

## Đã cập nhật (37 chỉ số) — script sẽ đẩy các chỉ số này

Xem chi tiết giá trị/nguồn trong `update-indicators.js` (mảng `DATA`). Tóm tắt nguồn chính:

- **FRED** (St. Louis Fed): DXY, UST10Y, VIX, T10Y3M, ICSA, T10YIE, SAHMREALTIME, CES0500000003, DFEDTARU
- **BLS**: CPI, PPI, Employment Situation (unemployment, NFP)
- **Eurostat / ECB**: CPI Eurozone, lãi suất ECB
- **BOJ**: lãi suất chính sách
- **NY Fed**: GSCPI
- **S&P Global / ISM**: PMI Việt Nam, PMI Mỹ
- **GSO (Tổng cục Thống kê VN)**: CPI VN, cán cân thương mại
- **Bộ KH&ĐT/FIA**: FDI
- **SBV**: tín dụng, tỷ giá trung tâm, dự trữ ngoại hối, NPL (qua báo chí)
- **Gartner**: chi tiêu IT toàn cầu
- **CNBC/Bloomberg/Al Jazeera/S&P Global (Lloyd's List liên quan)**: diễn biến Hormuz, phí bảo hiểm war-risk
- **ITIF/White & Case**: thuế Section 232

## Chưa có số liệu công khai đáng tin cậy (22 chỉ số) — cần nhập tay

Xem mảng `MANUAL_ONLY` trong script. Đây chủ yếu là dữ liệu khảo sát trả phí (Gartner/IDC/ISG/McKinsey/Deloitte theo vùng/phân khúc), báo giá ngân hàng/Bloomberg (FX forward, implied vol, VNIBOR), hoặc số liệu sự kiện cụ thể chưa có tin mới (can thiệp SBV, BIS Entity List đợt mới).

## Giới hạn cần lưu ý

- Một số chỉ số chỉ lấy được **một phần cấu phần** (vd Lợi suất 10Y chỉ có UST, chưa có JGB/Bund/VGB; Thất nghiệp chỉ có Mỹ) — đã ghi rõ trong `note` của từng entry.
- `cmpW`/`cmpM`/`cmpYtd`/`cmpYoy` chỉ điền khi có số liệu so sánh đáng tin cậy; nhiều chỉ số chỉ có giá trị hiện tại (không bịa số so sánh).
- Ngày quan sát đặt chung là 18/07/2026 (ngày tổng hợp), dù một số nguồn công bố sớm hơn vài ngày (đã ghi rõ ngày gốc trong `note`).

## Sources

- [US Dollar Index - Investing.com](https://www.investing.com/indices/usdollar)
- [Brent Crude Oil Futures Price Today - Investing.com](https://www.investing.com/commodities/brent-oil)
- [Euro US Dollar Exchange Rate - TradingEconomics](https://tradingeconomics.com/euro-area/currency)
- [Japanese Yen - TradingEconomics](https://tradingeconomics.com/japan/currency)
- [US 10 Year Treasury Note Yield - TradingEconomics](https://tradingeconomics.com/united-states/government-bond-yield)
- [CBOE Volatility Index (VIXCLS) - FRED](https://fred.stlouisfed.org/series/VIXCLS)
- [Tỷ giá trung tâm ngày 7/7/2026 - Infographics VNA](https://infographics.vn/interactive-ty-gia-trung-tam-ngay-7-7-2026-1-usd-25202-vnd/241409.vna)
- [Tỷ giá Vietcombank hôm nay 17-07-2026](https://tygiausd.org/nganhang/vietcombank)
- [Federal Reserve issues FOMC statement](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260617a.htm)
- [10-Year Treasury Constant Maturity Minus 3-Month (T10Y3M) - FRED](https://fred.stlouisfed.org/series/T10Y3M)
- [US Jobless Claims Decline to 208,000 - Bloomberg](https://www.bloomberg.com/news/articles/2026-07-16/us-jobless-claims-decline-to-208-000-below-economist-forecasts)
- [ICE BofA US Corporate Index OAS (BAMLC0A0CM) - FRED](https://fred.stlouisfed.org/series/BAMLC0A0CM)
- [10-Year Breakeven Inflation Rate (T10YIE) - FRED](https://fred.stlouisfed.org/series/T10YIE)
- [Real-time Sahm Rule Recession Indicator - FRED](https://fred.stlouisfed.org/series/SAHMREALTIME)
- [Real Earnings Summary June 2026 - BLS](https://www.bls.gov/news.release/realer.nr0.htm)
- [Consumer Price Index Summary June 2026 - BLS](https://www.bls.gov/news.release/cpi.nr0.htm)
- [Here's the inflation breakdown for June 2026 - CNBC](https://www.cnbc.com/2026/07/14/inflation-cpi-june-2026-in-one-chart.html)
- [June jobs report - CNBC](https://www.cnbc.com/2026/07/02/jobs-report-june-2026-.html)
- [ECB monetary policy decision June 2026](https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260611~4d41bd5e83.en.html)
- [BOJ rate hike to 1%, highest since 1995 - CNBC](https://www.cnbc.com/2026/06/16/boj-rate-hike-historic-inflation.html)
- [Euro area annual inflation down to 2.8% - Eurostat](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-17072026-ap)
- [CPI tháng 6.2026 giảm 0,39% - Báo Văn Hóa](https://baovanhoa.vn/multimedia/cpi-thang-62026-giam-039-lam-phat-co-ban-tang-014-243231.html)
- [CPI bình quân 6 tháng đầu năm 2026 đạt 4,38% - MarketTimes](https://markettimes.vn/cpi-thang-6-tang-4-69-so-voi-cung-ky-123696.html)
- [Cán cân thương mại đảo chiều, nhập siêu 16,7 tỷ USD - SGGP](https://www.sggp.org.vn/can-can-thuong-mai-dao-chieu-6-thang-dau-nam-nhap-sieu-gan-167-ty-usd-post860488.html)
- [Giải ngân vốn FDI nửa đầu năm 2026 lập kỷ lục](https://doanhnghiephoinhap.vn/giai-ngan-von-fdi-nua-dau-nam-2026-lap-ky-luc-cao-nhat-nua-thap-ky-142255.html)
- [FDI đăng ký vào Việt Nam đạt 34,65 tỷ USD - Investing.com](https://vn.investing.com/news/economy-news/fdi-dang-ky-vao-viet-nam-dat-3465-ty-usd-tang-61-sau-6-thang-2656637)
- [Đến ngày 26/6, tín dụng tăng 7,41% - Thời Báo Ngân Hàng](https://baomoi.com/den-ngay-26-6-tin-dung-tang-7-41-so-voi-cuoi-nam-2025-c55525809.epi)
- [Nợ xấu ngân hàng đầu năm 2026 - Phụ Nữ Việt Nam](https://baomoi.com/no-xau-ngan-hang-dau-nam-2026-ty-le-da-giam-nhung-ap-luc-thuc-con-lon-c55256389.epi)
- [Quy mô dự trữ ngoại hối đạt gần 88 tỷ USD - Thời báo Tài chính VN](https://thoibaotaichinhvietnam.vn/quy-mo-du-tru-ngoai-hoi-dat-gan-88-ty-usd-sap-sua-doi-nghi-dinh-ve-quan-ly-du-tru-ngoai-hoi-nha-nuoc-199542.html)
- [Quý 1/2026, kiều hối chuyển về TP.HCM giảm 15,6% - VnEconomy](https://vneconomy.vn/quy-12026-kieu-hoi-chuyen-ve-tp-ho-chi-minh-giam-156-dat-2-ty-usd.htm)
- [FOMC Summary of Economic Projections, June 2026 - FRED Blog](https://fredblog.stlouisfed.org/2026/06/fomc-summary-of-economic-projections-june-2026/)
- [2026 Strait of Hormuz crisis - Wikipedia](https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis)
- [Tanker traffic through Strait of Hormuz slows - CNBC](https://www.cnbc.com/2026/07/09/iran-strait-hormuz-oil-tanker-traffic-gulf-trump.html)
- [War risk shipping premium surges again - The National News](https://www.thenationalnews.com/business/2026/07/17/war-risk-shipping-premium-surges-again-as-tensions-escalate-at-strait-of-hormuz/)
- [Economic Consequences of Section 232 Tariffs on Semiconductor Imports - ITIF](https://itif.org/publications/2026/06/24/economic-consequences-of-section-232-tariffs-on-semiconductor-imports/)
- [Gartner Forecasts Worldwide IT Spending to Grow 13.5% in 2026](https://www.gartner.com/en/newsroom/press-releases/2026-04-22-gartner-forecasts-worldwide-it-spending-to-grow-13-point-5-percent-in-2026-totaling-6-point-31-trillion-dollars)
- [Global Supply Chain Pressure Index (GSCPI) - NY Fed](https://www.newyorkfed.org/research/policy/gscpi)
- [Baltic Dry Index climbs/falls - Hellenic Shipping News](https://www.hellenicshippingnews.com/baltic-dry-index-climbs-to-2797-up-50-points/)
- [Vietnam Manufacturing PMI stands at 51.8 in June - VOV](https://english.vov.vn/en/economy/vietnam-manufacturing-pmi-stands-at-518-in-june-signaling-solid-start-to-h2-post1311352.vov)
- [Manufacturing PMI at 53.3%; June 2026 ISM Report](https://www.prnewswire.com/news-releases/manufacturing-pmi-at-53-3-june-2026-ism-manufacturing-pmi-report-302814991.html)
- [Producer Price Index News Release June 2026 - BLS](https://www.bls.gov/news.release/ppi.nr0.htm)
- [Consumer Confidence Inched Down in June - Advisor Perspectives](https://www.advisorperspectives.com/dshort/updates/2026/06/30/consumer-confidence-conference-board-june-2026)

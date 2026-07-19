// update-indicators.js
// Chạy TRÊN MÁY BẠN (nơi server Next.js đang sống ở localhost:3000).
// Script tự lấy danh sách chỉ số hiện có trong DB (GET /api/indicators), khớp theo tên,
// rồi đẩy observation mới nhất (POST /api/indicators/:id/observations) cho từng chỉ số.
//
// Cách chạy: node update-indicators.js
// Yêu cầu: Node 18+ (có fetch sẵn). Server phải đang chạy ở BASE_URL bên dưới.

const BASE_URL = process.env.MACRO_API_BASE || "http://localhost:3000";
const AS_OF_DATE = "2026-07-18T00:00:00.000Z"; // ngày lấy số liệu

// ---------------------------------------------------------------------------
// Dữ liệu đã tra cứu (tới 18/07/2026). Chỉ gồm các chỉ số CÓ nguồn công khai xác
// nhận được giá trị thật — không bịa số cho chỉ số không có nguồn (xem danh sách
// "cần nhập tay" ở cuối file / trong console log khi chạy).
// ---------------------------------------------------------------------------
const DATA = [
  {
    name: "Chỉ số USD (broad)",
    value: 100.78,
    displayValue: "100,78",
    signal: "green",
    cmpM: "-0,07%",
    cmpYoy: "+2,33%",
    note: "DXY 100,78 (17/7), giảm nhẹ so tháng nhưng tăng 2,33% so cùng kỳ năm trước; USD hạ nhiệt sau CPI Mỹ yếu hơn dự báo.",
  },
  {
    name: "Giá dầu Brent & WTI",
    value: 88.10,
    displayValue: "88,10 USD/thùng",
    signal: "amber",
    note: "Brent tăng vọt +4,5% trong phiên (từ 84,23 lên đỉnh phiên 88,38) do Mỹ không kích Iran leo thang sau vụ tấn công tàu chở dầu ở Eo Hormuz. Trong vùng cảnh báo 85-100 USD.",
  },
  {
    name: "EUR/USD",
    value: 1.1446,
    displayValue: "1,1446",
    signal: "green",
    note: "EUR/USD 1,1446 (18/7), gần đỉnh kể từ 19/6 do USD yếu sau lạm phát Mỹ hạ nhiệt.",
  },
  {
    name: "USD/JPY",
    value: 162.08,
    displayValue: "162,08",
    signal: "amber",
    note: "USD/JPY quanh 162 - yên chịu sức ép từ giá dầu tăng do xung đột Mỹ-Iran, dù được hỗ trợ phần nào bởi USD yếu.",
  },
  {
    name: "USD/VND liên ngân hàng",
    value: 25254,
    displayValue: "25.254",
    signal: "red",
    cmpM: "+0,21%",
    note: "Tỷ giá trung tâm NHNN 17/7 ở mức 25.254 VND/USD (+11đ phiên trước, từ 25.202 ngày 7/7). Tỷ giá bán ra NHTM (Vietcombank) ~26.460, chỉ còn cách trần biên độ ±5% (~26.517) khoảng 0,2% — rất sát trần trong bối cảnh xung đột Mỹ-Iran đẩy giá dầu và USD biến động mạnh.",
  },
  {
    name: "EUR/VND (cross)",
    value: 30288,
    displayValue: "30.288",
    signal: "green",
    note: "Tính chéo EUR/USD (1,1446) × USD/VND bán ra Vietcombank (~26.460) ngày 17/7.",
  },
  {
    name: "JPY/VND (cross)",
    value: 163.25,
    displayValue: "163,25",
    signal: "green",
    note: "Tính chéo USD/VND bán ra (~26.460) ÷ USD/JPY (162,08) ngày 17/7.",
  },
  {
    name: "Lợi suất 10Y: UST/JGB/Bund/VGB",
    value: 4.56,
    displayValue: "4,56% (UST10Y)",
    signal: "amber",
    note: "UST10Y 4,55-4,57% (16-17/7), giảm nhẹ từ đỉnh 2 tháng 4,62% (13/7) sau CPI Mỹ yếu hơn dự báo. JGB/Bund/VGB: chưa lấy được số mới nhất — cần bổ sung tay (BOJ/Bundesbank/HNX-ADB cho VGB).",
  },
  {
    name: "VIX (chỉ số sợ hãi)",
    value: 16.73,
    displayValue: "16,73",
    signal: "green",
    note: "VIX 16,73 (đóng cửa 16/7), tăng 6,76% trong phiên nhưng vẫn dưới ngưỡng 20 dù căng thẳng Hormuz leo thang.",
  },
  {
    name: "Độ dốc đường cong 10Y–3M (Mỹ)",
    value: 0.70,
    displayValue: "+0,70 điểm %",
    signal: "green",
    note: "Chênh 10Y-3M dương +0,70 đến +0,78 điểm % (16-17/7), đường cong dốc lên, chưa có tín hiệu đảo ngược.",
  },
  {
    name: "Initial Jobless Claims (Mỹ)",
    value: 208000,
    displayValue: "208.000",
    signal: "green",
    note: "Số đơn xin trợ cấp thất nghiệp lần đầu giảm còn 208.000 (tuần kết thúc 11/7), giảm 8.000 so tuần trước, thấp hơn dự báo 217.000. TB 4 tuần: 214.250.",
  },
  {
    name: "Lãi suất chính sách Fed/BOJ/ECB/SBV",
    value: null,
    displayValue: "Fed 3,50-3,75% · ECB 2,25% · BOJ 1,00%",
    signal: "amber",
    note: "Fed giữ 3,50-3,75% (họp 17/6, dự kiến giữ tiếp 28-29/7); ECB nâng lên 2,25% (17/6, dự kiến giữ 23/7); BOJ nâng lên 1,00% (16/6, cao nhất từ 1995, dự kiến giữ 30-31/7). SBV: chưa có số lãi suất điều hành cụ thể — cần bổ sung tay từ sbv.gov.vn.",
  },
  {
    name: "Credit spread & corporate bond spread",
    value: 78,
    displayValue: "~78 bps (US IG OAS)",
    signal: "green",
    note: "US IG OAS ~77-80 điểm cơ bản, ổn định ở mức thấp lịch sử. Spread trái phiếu DN VN: chưa lấy được — cần TCBS/NHTM.",
  },
  {
    name: "Kỳ vọng lạm phát (UMich, breakeven)",
    value: 2.24,
    displayValue: "2,24%",
    signal: "green",
    note: "Breakeven 10Y (T10YIE) 2,24% (6/7), dưới ngưỡng cảnh báo 2,5%. UMich kỳ vọng 1 năm: chưa lấy được số riêng.",
  },
  {
    name: "Quy tắc Sahm (thất nghiệp)",
    value: 0.47,
    displayValue: "0,47",
    signal: "amber",
    note: "Chỉ số Sahm thời gian thực ở mức 0,47 (tháng 4/2026) — sát ngưỡng cảnh báo 0,50. Dữ liệu công bố có độ trễ; cần xác nhận số tháng 6/2026 mới nhất trên FRED SAHMREALTIME.",
  },
  {
    name: "Tăng lương / ECI / AHE (Mỹ)",
    value: 3.5,
    displayValue: "+3,5% yoy (AHE danh nghĩa)",
    signal: "green",
    note: "AHE +3,5% yoy (tháng 6), nhưng lương thực tế (đã trừ lạm phát) chỉ +0,1% yoy — sức ép lạm phát tiền lương chưa đáng ngại. ECI quý: chưa lấy được.",
  },
  {
    name: "CPI VN/US/JP/EU & Core PCE",
    value: null,
    displayValue: "VN +4,38% · US +3,5% · EU +2,8%",
    signal: "amber",
    cmpYoy: "VN +4,38%",
    note: "CPI Mỹ +3,5% yoy (6/2026, giảm từ tháng 5, MoM -0,4% - mạnh nhất từ 4/2020 nhờ năng lượng); Core Mỹ +2,6% yoy. CPI Eurozone +2,8% yoy (giảm từ 3,2%), core +2,4%. CPI VN bình quân 6 tháng +4,38% yoy (lạm phát cơ bản +4,12%); riêng tháng 6 giảm 0,39% MoM nhờ giá xăng dầu giảm — dưới ngưỡng đỏ 5,5%. CPI Nhật: chưa lấy được.",
  },
  {
    name: "CPI VN theo nhóm (xăng, điện, thực phẩm)",
    value: -4.85,
    displayValue: "Giao thông -4,85% MoM",
    signal: "green",
    note: "Nhóm giao thông (xăng dầu) CPI tháng 6 giảm mạnh 4,85% MoM (xăng -10,05%, diesel -10,63%) do điều chỉnh giá trong nước theo đà giảm thế giới trước đợt leo thang Hormuz giữa tháng 7 — số liệu tháng 7 nhiều khả năng đảo chiều tăng do Brent đã vọt lên ~88 USD.",
  },
  {
    name: "GDP VN/US/JP/EU (QoQ, YoY)",
    value: null,
    displayValue: "Mỹ Q2: nowcast ~2,1-3,0%",
    signal: "amber",
    note: "GDP Mỹ Q2/2026 (advance estimate) công bố 30/7. GDPNow (Atlanta Fed) dự báo ~3,0% (17/6), chuyên gia Philly Fed thận trọng hơn ~2,1% (sức ép thuế quan, tiêu dùng chậm lại). VN/Nhật/EU GDP quý mới nhất: chưa lấy được.",
  },
  {
    name: "Thất nghiệp Mỹ/EU/JP/VN & IIP VN",
    value: 4.2,
    displayValue: "Mỹ 4,2%",
    signal: "amber",
    note: "Thất nghiệp Mỹ giảm còn 4,2% (6/2026, từ 4,3%) nhưng chủ yếu do tỷ lệ tham gia lực lượng lao động giảm còn 61,5% - thấp nhất từ 3/2021, không hẳn tín hiệu tích cực thực chất. NFP chỉ +57.000 (thấp hơn dự báo 115.000). EU/Nhật/VN & IIP VN: chưa lấy được.",
  },
  {
    name: "PPI (dẫn CPI) & giá hàng hóa",
    value: -0.3,
    displayValue: "-0,3% MoM (Mỹ)",
    signal: "amber",
    note: "PPI Mỹ giảm 0,3% MoM (6/2026, mạnh nhất từ 4/2025) nhờ năng lượng giảm 6,4%; nhưng yoy vẫn +5,5%. FAO Food Price Index: chưa lấy được; xem Brent ở chỉ số brent-wti.",
  },
  {
    name: "Niềm tin tiêu dùng (CB, UMich)",
    value: 91.2,
    displayValue: "91,2",
    signal: "amber",
    note: "Conference Board CCI 91,2 (6/2026, +0,6đ so T5) nhưng thấp hơn dự báo 94,4. Expectations Index 74,4 — vẫn dưới ngưỡng cảnh báo suy thoái 80, liên tục từ 2/2025. % người thấy 'việc làm khó kiếm' lên 22,5% — cao nhất 5,5 năm. UMich: chưa lấy được.",
  },
  {
    name: "Global Supply Chain Pressure Index",
    value: 1.77,
    displayValue: "1,77",
    signal: "amber",
    note: "GSCPI 1,77 điểm (5/2026), giảm nhẹ từ đỉnh 1,82 (4/2026) — mức cao nhất kể từ 7/2022, cho thấy áp lực chuỗi cung ứng toàn cầu vẫn đáng kể.",
  },
  {
    name: "Baltic Dry (BDI) & cước container",
    value: 2840,
    displayValue: "2.840",
    signal: "amber",
    note: "BDI 2.840 điểm (16/7), giảm 3% phiên. Supramax lên 1.730 - cao nhất từ 8/2022, capesize giảm 5,6%. Cước container Drewry WCI: chưa lấy được riêng.",
  },
  {
    name: "Thuế 232 (chip/bán dẫn) & Mỹ–Trung",
    value: 25,
    displayValue: "25% (từ 15/1/2026)",
    signal: "red",
    note: "Thuế Section 232 25% với chip logic cao cấp (H200, MI325X...) hiệu lực từ 15/1/2026. Rà soát 1/7/2026 có thể mở rộng sang Phase 2 (toàn bộ bán dẫn + thiết bị SX) — ITIF ước tính có thể giảm GDP Mỹ 3,9% trong 10 năm nếu duy trì.",
  },
  {
    name: "Lưu lượng qua Hormuz / tin Iran–Israel–Mỹ",
    value: null,
    displayValue: "Alert — ~13 tàu/ngày (từ TB 33)",
    signal: "red",
    note: "Khủng hoảng Eo Hormuz 2026: Mỹ-Israel không kích Iran từ 28/2/2026, Iran tấn công tàu chở dầu & rải thủy lôi. Lưu lượng qua eo sập từ 120-140 tàu/ngày xuống còn ~13 tàu/ngày (so TB 33 tàu/ngày tuần trước, theo CNBC 9/7) sau vụ tấn công 3 tàu chở dầu UAE giữa tháng 7 khiến Mỹ tái áp trừng phạt dầu Iran. Kịch bản đã ở mức Alert.",
  },
  {
    name: "Phí bảo hiểm rủi ro chiến tranh (war-risk)",
    value: null,
    displayValue: "3-10 triệu USD/tàu 100tr USD",
    signal: "red",
    note: "Phí bảo hiểm rủi ro chiến tranh cho tàu qua Vịnh tăng lên 3-10 triệu USD/tàu 100 triệu USD (~5% giá trị tàu), so với ~250.000 USD trước xung đột — tăng 12-40 lần.",
  },
  {
    name: "Chi tiêu IT toàn cầu",
    value: 6.31,
    displayValue: "6,31 nghìn tỷ USD (+13,5%)",
    signal: "green",
    cmpYoy: "+13,5%",
    note: "Gartner (4/2026) dự báo chi tiêu IT toàn cầu 2026 đạt 6,31 nghìn tỷ USD, +13,5% yoy (nâng từ dự báo 10,8%/6,15T hồi tháng 2), động lực chính là hạ tầng data center AI (+55,8%).",
  },
  {
    name: "PMI New Export Orders",
    value: 51.8,
    displayValue: "51,8 (PMI VN)",
    signal: "green",
    note: "PMI sản xuất VN 51,8 (6/2026, S&P Global, công bố 1/7) — đơn hàng XK mới tăng nhẹ tháng thứ 2 liên tiếp dù chậm hơn tổng đơn hàng mới.",
  },
  {
    name: "PMI New Orders (SX & dịch vụ)",
    value: 56.0,
    displayValue: "56,0 (ISM New Orders, Mỹ)",
    signal: "green",
    note: "ISM New Orders Mỹ 56,0 (6/2026, giảm nhẹ từ 56,8) — mở rộng tháng thứ 6 liên tiếp, còn xa ngưỡng 50.",
  },
  {
    name: "Cán cân thương mại VN",
    value: -16700,
    displayValue: "Nhập siêu 16,7 tỷ USD (6T2026)",
    signal: "amber",
    cmpYoy: "Đảo chiều từ xuất siêu 8 tỷ USD",
    note: "6 tháng 2026 Việt Nam nhập siêu ~16,7 tỷ USD (đảo chiều từ xuất siêu ~8 tỷ USD cùng kỳ 2025) — XK 266,52 tỷ USD (+21% yoy), NK 283,17 tỷ USD (+33,4% yoy; nhập siêu từ Hàn Quốc +81%, Trung Quốc +39%). Trung bình ~2,8 tỷ USD/tháng — dưới ngưỡng đỏ 6 tỷ USD/tháng nhưng xu hướng đảo chiều cần theo dõi sát.",
  },
  {
    name: "FDI đăng ký & giải ngân VN",
    value: 13030,
    displayValue: "Giải ngân 13,03 tỷ USD (+11,2%)",
    signal: "green",
    cmpYoy: "+11,2%",
    note: "FDI đăng ký 6T2026 đạt 34,65 tỷ USD (+61% yoy); giải ngân 13,03 tỷ USD (+11,2%, cao nhất 5 năm) — không xảy ra kịch bản giải ngân giảm 15% như ngưỡng cảnh báo.",
  },
  {
    name: "Tăng trưởng tín dụng VN vs mục tiêu",
    value: 7.41,
    displayValue: "+7,41% (từ đầu năm)",
    signal: "green",
    note: "Tín dụng toàn hệ thống tăng 7,41-7,73% so cuối 2025 (tính đến 26-29/6/2026), đúng lộ trình so mục tiêu cả năm ~15%.",
  },
  {
    name: "Tỷ lệ nợ xấu (NPL) hệ thống VN",
    value: 1.55,
    displayValue: "~1,55%",
    signal: "green",
    note: "NPL toàn ngành ước giảm nhẹ 5 điểm cơ bản còn ~1,55% trong Q2/2026 (hiệu ứng pha loãng từ tăng trưởng tín dụng); LLR đi ngang ~94%. Một số NH riêng lẻ (Sacombank) có NPL tăng vọt lên ~5,6%.",
  },
  {
    name: "Dự trữ ngoại hối VN",
    value: 87.6,
    displayValue: "87,6 tỷ USD",
    signal: "amber",
    note: "Dự trữ ngoại hối ~87,6 tỷ USD (18/6/2026), giảm so đỉnh lịch sử 109,6 tỷ USD (1/2022) nhưng ổn định quanh mốc 87 tỷ từ 2022. IMF ước tính (9/2025) chỉ tương đương ~2 tháng nhập khẩu — thấp hơn chuẩn ARA 3-4 tháng của IMF, dư địa can thiệp tỷ giá mỏng trong bối cảnh nhập siêu và kiều hối giảm.",
  },
  {
    name: "Kiều hối về VN",
    value: 2.0,
    displayValue: "2,0 tỷ USD (Q1/2026, riêng TP.HCM)",
    signal: "amber",
    cmpYoy: "-16,9%",
    note: "Kiều hối về TP.HCM Q1/2026 đạt ~2,0 tỷ USD, giảm 15,6% so quý trước và 16,9% so cùng kỳ — do kinh tế thế giới phục hồi chậm, lạm phát cao ảnh hưởng thu nhập kiều bào. Số liệu toàn quốc 2026: chưa công bố (năm 2025 đạt kỷ lục ~16 tỷ USD).",
  },
  {
    name: "Fed dot plot & đường OIS ngụ ý",
    value: null,
    displayValue: "Trung vị cuối 2026: 3,8%",
    signal: "red",
    note: "SEP tháng 6/2026: dot plot đảo chiều hawkish, dự báo trung vị lãi suất cuối 2026 nâng lên 3,8% (từ 3,4%) — 9/18 thành viên dự báo ít nhất 1 lần tăng lãi, PCE dự báo cuối năm nâng lên 3,6%, tăng trưởng GDP hạ 20bp còn 2,2%. Kỳ họp đầu tiên dưới Chủ tịch Fed mới Kevin Warsh.",
  },
];

// ---------------------------------------------------------------------------
// Các chỉ số KHÔNG tìm được số liệu công khai đáng tin cậy tính đến 18/07/2026
// (khảo sát/quý trả phí, hoặc chỉ có trên báo giá NHTM/Bloomberg cần nhập tay).
// Không đẩy dữ liệu cho các chỉ số này — liệt kê để người dùng bổ sung tay.
// ---------------------------------------------------------------------------
const MANUAL_ONLY = [
  "% khách yêu cầu AI-augmented (Gartner/McKinsey survey)",
  "Niềm tin doanh nghiệp Tankan/Ifo (số kỳ mới nhất)",
  "Lead time chip / giao hàng (SIA/nhà cung cấp)",
  "Khí TTF (EU) / LNG châu Á (ICE/EIA)",
  "Tỷ giá kỳ hạn (FX forward) VND (báo giá NHTM/Bloomberg)",
  "Implied vol USD/VND, JPY/USD, EUR/USD (CME/NHTM)",
  "Guidance/capex hyperscaler & big-tech (earnings call quý)",
  "% DN có interest coverage <1 (IMF Article IV/FiinGroup)",
  "Quy mô thị trường IT outsourcing/BPO (KPMG/Statista/ISG)",
  "Chi tiêu IT theo vùng NA/JP/EU (Gartner/IDC breakdown)",
  "OECD CLI · CB LEI · Credit Impulse (số kỳ mới nhất)",
  "Tăng trưởng nearshoring (ISG/Deloitte)",
  "Tiêu chuẩn cho vay Fed SLOOS (báo cáo quý)",
  "Cước VLCC & container tuyến Trung Đông (Baltic/Drewry, số cụ thể)",
  "M2 & tín dụng VN; năng suất/TFP (SBV/IMF/WB)",
  "REER Việt Nam (BIS/IMF)",
  "Lãi vay ngắn hạn VND & VNIBOR O/N (SBV/NHTM)",
  "Dòng vốn ngoại VN-Index (HOSE/VNDirect)",
  "Can thiệp SBV & thỏa thuận Việt–Mỹ (sự kiện cụ thể)",
  "BIS Entity List / kiểm soát XK chip (hành động cụ thể mới)",
  "Spread VNIBOR O/N − Fed funds (thiếu vế VNIBOR)",
  "Chênh Fed−BOJ & US10Y−JGB10Y (thiếu vế JGB10Y)",
];

// ---------------------------------------------------------------------------
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function main() {
  console.log(`Đang lấy danh sách chỉ số từ ${BASE_URL}/api/indicators ...`);
  const res = await fetch(`${BASE_URL}/api/indicators`);
  if (!res.ok) {
    throw new Error(`GET /api/indicators thất bại: ${res.status} ${res.statusText}`);
  }
  const indicators = await res.json();
  const list = Array.isArray(indicators) ? indicators : indicators.data || [];

  const byNormName = new Map();
  for (const ind of list) {
    byNormName.set(normalize(ind.name), ind);
  }

  const unmatched = [];
  let updated = 0;

  const MAPPING = {
    "Chỉ số USD (broad)": "DXY (chỉ số USD)",
    "Kỳ vọng lạm phát (UMich, breakeven)": "Lõi CPI Mỹ / kỳ vọng LP",
    "Tăng lương / ECI / AHE (Mỹ)": "Lương giờ Mỹ (AHE)",
    "CPI VN/US/JP/EU & Core PCE": "CPI Mỹ (YoY)",
    "CPI VN theo nhóm (xăng, điện, thực phẩm)": "CPI nhiên liệu VN (giao thông)",
    "GDP VN/US/JP/EU (QoQ, YoY)": "Tăng trưởng GDP Mỹ",
    "Thất nghiệp Mỹ/EU/JP/VN & IIP VN": "Tỷ lệ thất nghiệp Mỹ",
    "Baltic Dry (BDI) & cước container": "Baltic Dry Index (cước khô)",
    "Lưu lượng qua Hormuz / tin Iran–Israel–Mỹ": "Lưu lượng tàu qua eo Hormuz",
    "PMI New Orders (SX & dịch vụ)": "PMI New Orders (ISM Mỹ / SX VN)",
    "Tăng trưởng tín dụng VN vs mục tiêu": "Tăng trưởng tín dụng VND",
    "Fed dot plot & đường OIS ngụ ý": "Kỳ vọng Fed (thị trường)"
  };

  for (const item of DATA) {
    const key = normalize(MAPPING[item.name] || item.name);
    let match = byNormName.get(key);

    // fallback: tìm theo chứa chuỗi con (khớp gần đúng) nếu không khớp tuyệt đối
    if (!match) {
      for (const ind of list) {
        const n = normalize(ind.name);
        if (n.includes(key) || key.includes(n)) {
          match = ind;
          break;
        }
      }
    }

    if (!match) {
      unmatched.push(item.name);
      continue;
    }

    const body = {
      date: AS_OF_DATE,
      signal: item.signal,
      note: item.note,
    };
    if (item.value !== null && item.value !== undefined) body.value = item.value;
    if (item.displayValue) body.displayValue = item.displayValue;
    if (item.cmpW) body.cmpW = item.cmpW;
    if (item.cmpM) body.cmpM = item.cmpM;
    if (item.cmpYtd) body.cmpYtd = item.cmpYtd;
    if (item.cmpYoy) body.cmpYoy = item.cmpYoy;

    const postRes = await fetch(`${BASE_URL}/api/indicators/${match.id}/observations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (postRes.ok) {
      updated++;
      console.log(`✔ Cập nhật: ${item.name} (id=${match.id})`);
    } else {
      const errText = await postRes.text().catch(() => "");
      console.log(`✘ Lỗi khi cập nhật "${item.name}" (id=${match.id}): ${postRes.status} ${errText}`);
    }
  }

  console.log("\n===== TỔNG KẾT =====");
  console.log(`Đã cập nhật: ${updated}/${DATA.length} chỉ số.`);
  if (unmatched.length) {
    console.log(`\nKhông khớp được tên trong DB (kiểm tra lại tên chỉ số trong hệ thống):`);
    unmatched.forEach((n) => console.log(`  - ${n}`));
  }
  console.log(`\nCác chỉ số CHƯA có số liệu công khai đáng tin cậy — cần nhập tay (${MANUAL_ONLY.length}):`);
  MANUAL_ONLY.forEach((n) => console.log(`  - ${n}`));
}

main().catch((err) => {
  console.error("Script thất bại:", err);
  process.exit(1);
});

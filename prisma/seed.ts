// prisma/seed.ts — Idempotent seed (upsert), chạy lại được nhiều lần

import { PrismaClient } from '@prisma/client'
import { TOPICS } from '../scripts/source-topics'

const prisma = new PrismaClient()

// Map freq → days back per spark point (approximate)
function freqToDaysBack(freq: string): number {
  const f = freq.toLowerCase()
  if (f.includes('ngày') || f.includes('kỳ 10')) return 1
  if (f.includes('tuần')) return 7
  if (f.includes('tháng')) return 30
  if (f.includes('quý')) return 90
  if (f.includes('họp') || f.includes('sự kiện')) return 90
  return 7
}

// Parse asOf "DD/MM" (vd "17/07") hoặc "MM/YY" (vd "07/26" = tháng 7/2026) → Date
function parseAsOf(asOf: string): Date {
  const m = /^(\d{2})\/(\d{2})$/.exec(asOf?.trim() || '')
  if (!m) return new Date(2026, 6, 18) // default: 18/07/2026
  const a = +m[1], b = +m[2]
  // b > 12 không thể là tháng hợp lệ ⇒ đây là "MM/YY", không phải "DD/MM"
  if (b > 12) return new Date(2000 + b, a - 1, 1)
  return new Date(2026, b - 1, a)
}

// Định nghĩa từ theo-doi-chi-so.md — match gần đúng theo tên
const DEFINITIONS: Record<string, { definition?: string; thresholdText?: string; pnlChannel?: string; markValue?: number }> = {
  'USD/VND liên ngân hàng': {
    pnlChannel: 'margin outsourcing (USD/JPY/EUR) · giá vốn thiết bị nhập · chi phí hedge',
    thresholdText: '🔴 cách trần <1% · 🟡 gần trần',
    definition: 'Tỷ giá USD/VND liên ngân hàng. Kênh ảnh hưởng: margin outsourcing, giá vốn thiết bị nhập khẩu, chi phí hedge.'
  },
  'USD/JPY': {
    pnlChannel: 'margin outsourcing Nhật',
    thresholdText: 'JPY mạnh → DT Nhật quy VND ↑',
    definition: 'Tỷ giá USD/JPY. JPY yếu → doanh thu outsourcing Nhật quy VND bị bào mòn.'
  },
  'DXY (chỉ số USD)': {
    thresholdText: '🟢 USD yếu → hỗ trợ VND & JPY',
    definition: 'DXY — chỉ số sức mạnh USD so rổ 6 tiền tệ lớn. USD yếu hỗ trợ VND và các đồng tiền mới nổi.'
  },
  'Dự trữ ngoại hối VN': {
    thresholdText: '🔴 dưới 3 tháng NK bình quân (ngưỡng động, ~$150B ở mức NK hiện tại)',
    definition: 'Dự trữ ngoại hối Việt Nam. Ngưỡng an toàn IMF: tối thiểu 3 tháng nhập khẩu.'
  },
  'Lãi suất chính sách Fed': {
    pnlChannel: 'chi phí vốn lưu động + ngân sách IT khách hàng',
    thresholdText: '🔴 Fed >4.0% → cầu IT Mỹ ↓',
    definition: 'Lãi suất chính sách của Fed. Tác động trực tiếp đến ngân sách IT của khách hàng Mỹ và chi phí vốn toàn cầu.'
  },
  'Độ dốc đường cong 10Y−3M': {
    thresholdText: '🔴 đảo ngược → suy thoái ~12 tháng sau',
    definition: 'Spread giữa lợi suất trái phiếu Mỹ 10 năm và 3 tháng. Đảo ngược là chỉ báo suy thoái kinh điển với độ trễ 12 tháng.',
    markValue: 0
  },
  'Tăng trưởng tín dụng VND': {
    thresholdText: 'Vượt 15% → rủi ro quá nóng/NPL',
    definition: 'Tăng trưởng tín dụng hệ thống ngân hàng VN so đầu năm. Mục tiêu SBV ~15%/năm.'
  },
  'PMI New Orders (ISM Mỹ / SX VN)': {
    thresholdText: '🔴 <50 co lại → cầu IT ↓ sau 1–2 tháng',
    definition: 'Chỉ số PMI đơn hàng mới: >50 mở rộng, <50 co lại. Leading indicator cho cầu outsourcing 1–2 tháng sau.',
    markValue: 50
  },
  'PMI sản xuất VN': {
    thresholdText: '>50 mở rộng, <50 co lại',
    definition: 'PMI sản xuất Việt Nam (S&P Global). 12 tháng liên tiếp >50 là tín hiệu tích cực cho xuất khẩu và FDI.',
    markValue: 50
  },
  'Cán cân thương mại VN': {
    pnlChannel: 'giá vốn thiết bị nhập + cầu hạ tầng nội địa (FDI)',
    thresholdText: '🔴 thâm hụt >$6B/tháng → áp lực VND',
    definition: 'Cán cân thương mại hàng hóa VN. Thâm hụt lớn tạo áp lực cầu ngoại tệ lên VND.'
  },
  'Baltic Dry Index (cước khô)': {
    thresholdText: '🟡 spike → logistics & giá nhập↑',
    definition: 'BDI — chỉ số cước vận tải hàng khô. Spike mạnh báo hiệu chi phí logistics và giá nhập khẩu tăng.'
  },
  'Chỉ số bán dẫn (VanEck SMH)': {
    definition: 'Giá đóng cửa VanEck Semiconductor ETF (SMH, NASDAQ) — theo dõi rổ cổ phiếu bán dẫn toàn cầu, thường dùng làm proxy cho chu kỳ cầu chip/AI.'
  },
  'Hang Seng TECH Index (HSTECH)': {
    definition: 'Hang Seng TECH Index (HSTECH) — rổ 30 cổ phiếu công nghệ lớn nhất niêm yết tại Hong Kong (Alibaba, Tencent, Xiaomi, Meituan, BYD, JD.com...), đại diện khẩu vị rủi ro và sức khỏe ngành công nghệ/AI Trung Quốc — vai trò tương tự Nasdaq-100 nhưng cho thị trường Trung Quốc.',
    thresholdText: 'Giảm sâu, liên tục nhiều phiên → thị trường lo ngại tăng trưởng/định giá nhóm công nghệ Trung Quốc, rủi ro lan sang tâm lý rủi ro chung khu vực châu Á.'
  },
  'Giá dầu Brent': {
    pnlChannel: 'chi phí vận hành + lạm phát nhập khẩu',
    thresholdText: '🔴 Brent >$100 hoặc +20%/tuần · 🟡 $85–100',
    definition: 'Giá dầu Brent — chuẩn quốc tế. >$100 kích hoạt kịch bản Alert Hormuz; $85–100 là vùng cảnh báo.'
  },
  'Lưu lượng tàu qua eo Hormuz': {
    thresholdText: '🔴 <30 tàu/ngày (bình thường ~60)',
    definition: 'Số lượt tàu thương mại qua eo Hormuz/ngày. Bình thường ~60 tàu/ngày. <30 = gián đoạn nghiêm trọng.'
  },
  'CPI Mỹ (YoY)': {
    thresholdText: '🔴 CPI Mỹ >4% kéo dài → Fed duy trì lãi suất cao, siết ngân sách IT khách hàng',
    definition: 'CPI Mỹ year-over-year. Fed mục tiêu 2%. >4% → Fed duy trì lãi suất cao, siết ngân sách IT khách hàng.'
  },
  'CPI Việt Nam (YoY)': {
    pnlChannel: 'chi phí vận hành nội địa',
    thresholdText: '🔴 >5.5% liên tục 2 tháng → SBV tăng lãi',
    definition: 'CPI Việt Nam year-over-year. SBV mục tiêu <4.5%. Vượt 5.5% 2 tháng liên tiếp → SBV có thể tăng lãi.'
  },

  // fx
  'Lãi suất điều hành SBV': {
    definition: 'Lãi suất điều hành của Ngân hàng Nhà nước Việt Nam. Ảnh hưởng trực tiếp đến lãi vay VND và áp lực lên tỷ giá USD/VND.',
    thresholdText: 'Tăng mạnh/đột ngột → tín hiệu SBV bảo vệ VND, chi phí vốn VND tăng theo.'
  },
  'Cán cân TM (cung ngoại tệ)': {
    definition: 'Cán cân thương mại hàng hoá VN, một cấu phần chính của cung–cầu ngoại tệ. Cùng nhóm theo dõi với FDI giải ngân và kiều hối.',
    thresholdText: 'Nhập siêu / kiều hối giảm → VND yếu, thường dẫn 1–2 quý.'
  },
  'FDI giải ngân (cung USD)': {
    definition: 'Vốn FDI giải ngân thực tế — một nguồn cung USD quan trọng cho thị trường ngoại hối VN, cùng nhóm với cán cân thương mại và kiều hối.',
    thresholdText: 'Giải ngân giảm → cung USD nội địa giảm, áp lực lên VND.'
  },
  'Tỷ giá kỳ hạn USD/VND (Forward 3M)': {
    definition: 'Tỷ giá kỳ hạn (forward) USD/VND kỳ 3 tháng tại NHTM — phản ánh kỳ vọng thị trường về biến động VND trong ngắn hạn.',
    thresholdText: 'Forward mất giá nhiều hơn spot → kỳ vọng VND tiếp tục yếu.'
  },
  'Dòng vốn FII (khối ngoại)': {
    definition: 'Dòng vốn đầu tư gián tiếp nước ngoài (khối ngoại) trên TTCK Việt Nam — tương tự chỉ báo "foreign flow VN-Index".',
    thresholdText: 'Bán ròng kéo dài → giảm cung USD nội địa, áp lực lên tỷ giá.'
  },

  // demand
  'Capex hyperscaler / data center': {
    definition: 'Kế hoạch chi vốn (capex) của các hyperscaler & big-tech cho hạ tầng data center/AI — dẫn dắt nhu cầu dịch vụ IT outsourcing.',
    thresholdText: 'Cắt giảm guidance capex → chuỗi dịch vụ IT liên quan co lại.'
  },
  'Thất nghiệp Mỹ (ngân sách khách)': {
    definition: 'Tỷ lệ thất nghiệp và số đơn xin trợ cấp thất nghiệp (jobless claims) tại Mỹ — ảnh hưởng ngân sách chi tiêu IT của khách hàng Mỹ.',
    thresholdText: 'Thất nghiệp tăng → ngân sách IT của khách hàng Mỹ có xu hướng giảm.'
  },
  'Nearshoring (cạnh tranh thị phần)': {
    definition: 'Tốc độ tăng trưởng xu hướng nearshoring (chuyển dịch outsourcing về gần thị trường tiêu thụ) — rủi ro cạnh tranh thị phần với VN.',
    thresholdText: 'Tăng trưởng nearshoring 15–20%/năm → rủi ro VN mất thị phần outsourcing.'
  },
  'Chi tiêu IT toàn cầu 2026': {
    definition: 'Tổng chi tiêu CNTT toàn cầu (USD, %YoY) theo Gartner/IDC — chỉ báo core cho quy mô thị trường outsourcing.',
    thresholdText: 'Giảm tốc tăng trưởng → doanh thu outsourcing có xu hướng giảm theo.'
  },
  'Dự báo tăng trưởng IT năm': {
    definition: 'Dự báo tăng trưởng chi tiêu CNTT cả năm (Gartner) — theo dõi xu hướng điều chỉnh dự báo qua các kỳ cập nhật.',
    thresholdText: 'Dự báo bị hạ liên tiếp → tín hiệu cầu IT toàn cầu chững lại.'
  },
  'Cổ phiếu công nghệ (Nasdaq-100)': {
    definition: 'Chỉ số Nasdaq-100 — proxy cho khẩu vị rủi ro và kỳ vọng tăng trưởng nhóm công nghệ/AI, thường đi cùng nhịp với capex hyperscaler.',
    thresholdText: 'Điều chỉnh sâu kéo dài → tín hiệu thị trường hạ kỳ vọng tăng trưởng nhóm công nghệ.'
  },

  // rates
  'Kỳ vọng Fed (thị trường)': {
    definition: 'Kỳ vọng thị trường về lộ trình lãi suất Fed (dot plot, đường OIS ngụ ý qua hợp đồng tương lai CME).',
    thresholdText: 'Kỳ vọng dời thời điểm cắt lãi → định hình lại chi phí vốn toàn cầu.'
  },
  'Kiểm soát tín dụng BĐS': {
    definition: 'Mức độ siết/nới tín dụng vào lĩnh vực bất động sản VN — liên quan tăng trưởng tín dụng hệ thống và tỷ lệ nợ xấu (NPL).',
    thresholdText: 'Siết mạnh → tín dụng hệ thống chậm lại, rủi ro NPL nhóm BĐS cần theo dõi.'
  },
  'Lãi vay ngắn hạn VND (BQ)': {
    definition: 'Lãi suất vay ngắn hạn VND bình quân tại NHTM — chi phí vốn lưu động trực tiếp của doanh nghiệp.',
    thresholdText: 'Tăng nhanh → chi phí vốn lưu động tăng ngay, ảnh hưởng biên lợi nhuận.'
  },
  'Lãi vay liên NH qua đêm (VNIBOR O/N)': {
    definition: 'Lãi suất liên ngân hàng qua đêm (VNIBOR O/N) — thước đo thanh khoản hệ thống NHTM, ảnh hưởng trực tiếp chi phí vốn lưu động.',
    thresholdText: 'Tăng vọt → thanh khoản hệ thống căng thẳng, chi phí vốn ngắn hạn tăng.'
  },

  // trade
  'Cước container (Drewry WCI)': {
    definition: 'Chỉ số cước vận tải container thế giới (Drewry World Container Index) — cùng nhóm theo dõi với Baltic Dry Index.',
    thresholdText: 'Spike mạnh → chi phí logistics và giá nhập khẩu thiết bị tăng.'
  },
  'Chuỗi cung ứng / lead time chip': {
    definition: 'Thời gian giao hàng (lead time) linh kiện bán dẫn từ nhà cung cấp — chỉ báo rủi ro gián đoạn chuỗi cung ứng.',
    thresholdText: 'Lead time kéo dài → rủi ro dòng tiền và tồn kho tăng.'
  },
  'FDI đăng ký & giải ngân': {
    definition: 'Vốn FDI đăng ký và giải ngân thực tế vào VN — chỉ báo cầu hạ tầng CNTT nội địa.',
    thresholdText: 'Giải ngân giảm >15% YoY → cầu hạ tầng IT nội địa có xu hướng giảm.'
  },
  'FDI đăng ký mới': {
    definition: 'Vốn FDI đăng ký mới (cam kết) — chỉ báo dẫn dắt (leading) cho dòng vốn giải ngân thực tế các quý sau.',
    thresholdText: 'Cam kết đăng ký giảm → vốn giải ngân thực tế nhiều khả năng giảm theo sau.'
  },

  // macro
  'Lõi CPI Mỹ / kỳ vọng LP': {
    definition: 'Core CPI Mỹ và kỳ vọng lạm phát thị trường (UMich, breakeven inflation) — chỉ báo dẫn dắt cho định hướng chính sách Fed.',
    thresholdText: 'Breakeven lạm phát >2,5% → Fed nghiêng hawkish, duy trì lãi suất cao lâu hơn.'
  },
  'Lương giờ Mỹ (AHE)': {
    definition: 'Tăng trưởng lương giờ bình quân Mỹ (Average Hourly Earnings) — nếu vượt tăng năng suất sẽ tạo áp lực lạm phát dịch vụ dai dẳng.',
    thresholdText: 'Tăng lương vượt năng suất lao động → lạm phát dịch vụ dai dẳng, Fed khó hạ lãi.'
  },
  'Tăng trưởng GDP Mỹ': {
    definition: 'Tăng trưởng GDP Mỹ theo quý (QoQ, YoY) — chỉ báo sức khoẻ kinh tế lớn nhất chi phối ngân sách IT toàn cầu.',
    thresholdText: 'Mỹ suy giảm tăng trưởng → doanh nghiệp Mỹ có xu hướng cắt ngân sách IT.'
  },
  'Tăng trưởng GDP Việt Nam': {
    definition: 'Tăng trưởng GDP Việt Nam theo quý — phản ánh sức khoẻ vĩ mô và động lực đầu tư, xuất khẩu trong nước.',
    thresholdText: 'Tăng trưởng chậm lại kéo dài → rủi ro với cầu nội địa và dòng vốn đầu tư.'
  },
  'Tỷ lệ thất nghiệp Mỹ': {
    definition: 'Tỷ lệ thất nghiệp Mỹ — cùng nhóm theo dõi với IIP VN, chỉ báo sức khoẻ thị trường lao động Mỹ.',
    thresholdText: 'Tỷ lệ thất nghiệp Mỹ tăng lên vùng 4,4–4,6% → cảnh báo rủi ro suy thoái.'
  },
  'M2 Việt Nam': {
    definition: 'Cung tiền M2 Việt Nam — nền tảng thanh khoản hệ thống, theo dõi cùng tăng trưởng tín dụng và năng suất (TFP).',
    thresholdText: 'Mở rộng nhanh hơn nhiều so với tăng trưởng GDP → rủi ro áp lực lạm phát.'
  },

  // hormuz
  'Giá dầu WTI': {
    definition: 'Giá dầu WTI (West Texas Intermediate) — chuẩn dầu thô Mỹ, theo dõi song song với Brent trong kịch bản Hormuz.',
    thresholdText: 'Cùng ngưỡng theo dõi với Brent: >$100 hoặc +20%/tuần là vùng báo động.'
  },
  'Trạng thái kịch bản Hormuz': {
    definition: 'Trạng thái tổng hợp của kịch bản gián đoạn eo Hormuz, tổng hợp từ giá Brent và mức độ căng thẳng địa chính trị.',
    thresholdText: '🟢 Bình thường (Brent <$85) → 🟡 Watch (Brent $85–100 / căng thẳng) → 🔴 Alert (đóng một phần eo / Brent >$100).'
  },
  'Lộ trình Fed (higher-for-longer)': {
    definition: 'Lộ trình lãi suất Fed trong kịch bản lạm phát năng lượng tăng do gián đoạn Hormuz đẩy Fed trì hoãn cắt lãi.',
    thresholdText: 'Fed hoãn cắt lãi vì lạm phát năng lượng → ngân sách IT khách hàng Mỹ bị siết thêm.'
  },
  'Giá xăng E10 RON95 VN': {
    definition: 'Giá bán lẻ xăng E10 RON95 trong nước, điều chỉnh theo kỳ điều hành ~10 ngày/lần (liên Bộ Công Thương–Tài chính).',
    thresholdText: 'Xăng/điện tăng → áp lực CPI và khả năng SBV tăng lãi suất điều hành.'
  },
  'CPI nhiên liệu VN (giao thông)': {
    definition: 'Chỉ số CPI nhóm nhiên liệu/giao thông VN (xăng, điện) — cấu phần nhạy với giá dầu thế giới trong CPI chung.',
    thresholdText: 'Xăng/điện tăng mạnh → áp lực SBV tăng lãi suất điều hành.'
  },
  'Lưu lượng dầu qua eo Hormuz': {
    definition: 'Lưu lượng dầu thô ước tính qua eo Hormuz (thùng/ngày) — cùng nhóm theo dõi với lưu lượng tàu, chỉ báo mức độ gián đoạn thực tế.',
    thresholdText: 'Giảm mạnh so với mức bình thường (~20 triệu thùng/ngày) → kích hoạt kịch bản gián đoạn.'
  },
  'Cước VLCC & container Trung Đông': {
    definition: 'Cước vận tải tàu chở dầu cỡ lớn (VLCC) và container tuyến Trung Đông — phản ánh chi phí bảo hiểm/rủi ro vận tải khu vực.',
    thresholdText: 'Cước tăng gấp đôi so với mức bình thường → giá nhập khẩu thiết bị tăng theo.'
  },
  'Phí bảo hiểm rủi ro chiến tranh': {
    definition: 'Phí bảo hiểm rủi ro chiến tranh (war-risk premium) cho tàu qua khu vực xung đột — chỉ báo dẫn dắt sớm cho căng thẳng leo thang.',
    thresholdText: 'Phí bảo hiểm tăng vọt (spike) → chi phí vận tải tăng và nguy cơ chậm giao hàng.'
  },
}

// Nguồn dữ liệu (chỉ tên miền trang web, không phải link bài viết cụ thể) — theo đúng các
// nguồn đã dùng trong dự án (xem bao-cao-cap-nhat-18-07-2026.md, macro-dashboard-0718.html
// footer "Nguồn dữ liệu"). match theo tên chỉ số (ind.n), giống cách DEFINITIONS hoạt động.
const SOURCES: Record<string, string> = {
  'USD/VND liên ngân hàng': 'sbv.gov.vn, vietcombank.com.vn',
  'Tỷ giá kỳ hạn USD/VND (Forward 3M)': 'investing.com',
  'USD/JPY': 'tradingeconomics.com',
  'DXY (chỉ số USD)': 'investing.com',
  'Dự trữ ngoại hối VN': 'sbv.gov.vn, thoibaotaichinhvietnam.vn',
  'Dòng vốn FII (khối ngoại)': 'hsx.vn, vndirect.com.vn',
  'Lãi suất điều hành SBV': 'sbv.gov.vn',
  'Cán cân TM (cung ngoại tệ)': 'gso.gov.vn, customs.gov.vn',
  'FDI giải ngân (cung USD)': 'mpi.gov.vn',

  'Chi tiêu IT toàn cầu 2026': 'gartner.com',
  'Dự báo tăng trưởng IT năm': 'gartner.com',
  'PMI New Orders (ISM Mỹ / SX VN)': 'ismworld.org, spglobal.com',
  'Cổ phiếu công nghệ (Nasdaq-100)': 'nasdaq.com',
  'Chỉ số bán dẫn (VanEck SMH)': 'vaneck.com, cnbc.com',
  'Hang Seng TECH Index (HSTECH)': 'hsi.com.hk, investing.com',
  'Capex hyperscaler / data center': 'gartner.com',
  'Thất nghiệp Mỹ (ngân sách khách)': 'bls.gov',
  'Nearshoring (cạnh tranh thị phần)': 'isg-one.com',

  'Lãi suất chính sách Fed': 'federalreserve.gov',
  'Độ dốc đường cong 10Y−3M': 'fred.stlouisfed.org',
  'Lãi vay ngắn hạn VND (BQ)': 'sbv.gov.vn',
  'Lãi vay liên NH qua đêm (VNIBOR O/N)': 'sbv.gov.vn, vnba.org.vn',
  'Tăng trưởng tín dụng VND': 'sbv.gov.vn',
  'Kỳ vọng Fed (thị trường)': 'cmegroup.com',
  'Kiểm soát tín dụng BĐS': 'sbv.gov.vn',

  'Cán cân thương mại VN': 'customs.gov.vn, gso.gov.vn',
  'FDI đăng ký & giải ngân': 'mpi.gov.vn',
  'PMI sản xuất VN': 'spglobal.com',
  'FDI đăng ký mới': 'mpi.gov.vn',
  'Baltic Dry Index (cước khô)': 'balticexchange.com',
  'Cước container (Drewry WCI)': 'drewry.co.uk',
  'Chuỗi cung ứng / lead time chip': 'semiconductors.org',

  'CPI Mỹ (YoY)': 'bls.gov',
  'Tăng trưởng GDP Mỹ': 'bea.gov',
  'Tăng trưởng GDP Việt Nam': 'gso.gov.vn',
  'CPI Việt Nam (YoY)': 'gso.gov.vn',
  'Tỷ lệ thất nghiệp Mỹ': 'bls.gov',
  'M2 Việt Nam': 'sbv.gov.vn',
  'Lõi CPI Mỹ / kỳ vọng LP': 'bls.gov, fred.stlouisfed.org',
  'Lương giờ Mỹ (AHE)': 'bls.gov',

  'Giá dầu Brent': 'investing.com, eia.gov',
  'Giá xăng E10 RON95 VN': 'moit.gov.vn, petrolimex.com.vn',
  'CPI nhiên liệu VN (giao thông)': 'gso.gov.vn',
  'Lưu lượng tàu qua eo Hormuz': 'hormuzstraitmonitor.com',
  'Lưu lượng dầu qua eo Hormuz': 'hormuzstraitmonitor.com',
  'Cước VLCC & container Trung Đông': 'balticexchange.com',
  'Phí bảo hiểm rủi ro chiến tranh': 'thenationalnews.com, lloydslist.com',
  'Giá dầu WTI': 'investing.com, eia.gov',
  'Trạng thái kịch bản Hormuz': 'cnbc.com, en.wikipedia.org',
  'Lộ trình Fed (higher-for-longer)': 'federalreserve.gov, fredblog.stlouisfed.org',
}

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Seed WeeklyReport tuần 18/07/2026
  const weekOf = new Date(2026, 6, 18) // 18/07/2026
  const report = await prisma.weeklyReport.upsert({
    where: { id: 'report-2026-07-18' },
    update: {},
    create: {
      id: 'report-2026-07-18',
      weekOf,
      publishDate: weekOf,
      status: 'risk',
      thesis: 'USD/VND áp sát trần biên độ (~26.460, cách trần 0,2%) và khủng hoảng Eo Hormuz leo thang (Brent +15%/tuần lên $88,10, phí bảo hiểm chiến tranh tăng 12–40 lần) là 2 rủi ro chính trong tuần; Fed đảo chiều hawkish (SEP tháng 6, median 3,8% cuối 2026) trong khi lạm phát Mỹ/VN hạ nhiệt tháng 6 nhưng nhiều khả năng đảo chiều tháng 7 do giá dầu tăng vọt.',
    }
  })
  console.log(`✅ WeeklyReport: ${report.id}`)

  // 2. Seed Topics + Indicators + Observations
  for (let ti = 0; ti < TOPICS.length; ti++) {
    const topic = TOPICS[ti]

    // Upsert Topic
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: { code: topic.code, icon: topic.ic, name: topic.name, sortOrder: ti },
      create: { id: topic.id, code: topic.code, icon: topic.ic, name: topic.name, sortOrder: ti }
    })

    // Upsert TopicWeeklyStatus
    await prisma.topicWeeklyStatus.upsert({
      where: { weeklyReportId_topicId: { weeklyReportId: report.id, topicId: topic.id } },
      update: { status: topic.status, trend: topic.trend },
      create: {
        weeklyReportId: report.id,
        topicId: topic.id,
        status: topic.status,
        trend: topic.trend,
        driverNote: ''
      }
    })

    // Seed core indicators
    const allIndicators = [
      ...topic.core.map((ind, i) => ({ ...ind, category: 'core', sortOrder: i })),
      ...topic.context.map((ind, i) => ({ ...ind, category: 'context', sortOrder: i })),
    ]

    for (const ind of allIndicators) {
      const defMatch = DEFINITIONS[ind.n] || {}
      const sourceMatch = SOURCES[ind.n] ?? null
      const manualEntry = 'flag' in ind && (ind as any).flag === 'manual'

      // Find or create indicator by name+topicId (idempotent)
      let indicator = await prisma.indicator.findFirst({
        where: { topicId: topic.id, name: ind.n }
      })

      if (!indicator) {
        indicator = await prisma.indicator.create({
          data: {
            topicId: topic.id,
            category: ind.category,
            name: ind.n,
            freq: ind.freq,
            manualEntry,
            sortOrder: ind.sortOrder,
            definition: defMatch.definition ?? null,
            thresholdText: defMatch.thresholdText ?? null,
            pnlChannel: defMatch.pnlChannel ?? null,
            markValue: defMatch.markValue ?? null,
            source: sourceMatch,
          }
        })
      } else {
        await prisma.indicator.update({
          where: { id: indicator.id },
          data: {
            category: ind.category,
            freq: ind.freq,
            manualEntry,
            sortOrder: ind.sortOrder,
            definition: defMatch.definition ?? indicator.definition,
            thresholdText: defMatch.thresholdText ?? indicator.thresholdText,
            pnlChannel: defMatch.pnlChannel ?? indicator.pnlChannel,
            markValue: defMatch.markValue ?? indicator.markValue,
            source: sourceMatch ?? indicator.source,
          }
        })
      }

      // Seed Observations from spark array
      const spark: number[] = Array.isArray((ind as any).spark) ? (ind as any).spark : []
      const cmp: Record<string, string> = (ind as any).cmp || {}
      const asOfDate = parseAsOf(ind.asOf)
      const daysBack = freqToDaysBack(ind.freq)

      // Build observations array (oldest to newest)
      const obsToCreate = spark.map((val, idx) => {
        const isLast = idx === spark.length - 1
        // Date: lùi từ asOf
        const daysFromEnd = (spark.length - 1 - idx) * daysBack
        const date = new Date(asOfDate)
        date.setDate(date.getDate() - daysFromEnd)

        return {
          indicatorId: indicator!.id,
          date,
          value: typeof val === 'number' ? val : null,
          displayValue: isLast ? ind.v : String(val),
          signal: ind.sig === 'green' ? 'green' : ind.sig === 'amber' ? 'amber' : 'red',
          note: isLast ? ind.note : null,
          cmpW: isLast ? (cmp.w ?? null) : null,
          cmpM: isLast ? (cmp.m ?? null) : null,
          cmpYtd: isLast ? (cmp.ytd ?? null) : null,
          cmpYoy: isLast ? (cmp.yoy ?? null) : null,
        }
      })

      // If no spark, create single observation from asOf + v
      if (obsToCreate.length === 0) {
        obsToCreate.push({
          indicatorId: indicator.id,
          date: asOfDate,
          value: null,
          displayValue: ind.v,
          signal: ind.sig === 'green' ? 'green' : ind.sig === 'amber' ? 'amber' : 'red',
          note: ind.note,
          cmpW: cmp.w ?? null,
          cmpM: cmp.m ?? null,
          cmpYtd: cmp.ytd ?? null,
          cmpYoy: cmp.yoy ?? null,
        })
      }

      // Upsert each observation
      for (const obs of obsToCreate) {
        await prisma.observation.upsert({
          where: { indicatorId_date: { indicatorId: obs.indicatorId, date: obs.date } },
          update: { displayValue: obs.displayValue, signal: obs.signal, note: obs.note, cmpW: obs.cmpW, cmpM: obs.cmpM, cmpYtd: obs.cmpYtd, cmpYoy: obs.cmpYoy },
          create: obs
        })
      }
    }

    // Seed NewsItems
    for (const news of topic.news) {
      const existingNews = await prisma.newsItem.findFirst({
        where: { weeklyReportId: report.id, topicId: topic.id, text: news.t }
      })
      if (!existingNews) {
        await prisma.newsItem.create({
          data: {
            weeklyReportId: report.id,
            topicId: topic.id,
            tone: news.tone,
            text: news.t,
          }
        })
      }
    }

    console.log(`  ✅ Topic ${topic.code}: ${topic.name} — ${topic.core.length} core + ${topic.context.length} context`)
  }

  console.log('🎉 Seed completed!')

  // Print unmatched indicators
  const unmatched = await prisma.indicator.findMany({
    where: { definition: null, category: 'core' },
    select: { name: true, topicId: true }
  })
  if (unmatched.length > 0) {
    console.log('\n⚠️  Indicators without definition (add manually):')
    unmatched.forEach(i => console.log(`  - [${i.topicId}] ${i.name}`))
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

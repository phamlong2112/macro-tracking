// scripts/source-topics.ts
// Dữ liệu thật tra cứu ngày 18/07/2026 — copy nguyên từ macro-dashboard-0718.html

export const TOPICS = [
{
  id:"fx", code:"A", ic:"💱", name:"Tỷ giá & Ngoại hối", status:"risk", trend:"down",
  core:[
    {n:"USD/VND liên ngân hàng", v:"26.460", asOf:"17/07", freq:"Ngày", sig:"red", note:"Tỷ giá trung tâm NHNN lên 25.254 (17/07, +11đ so 7/07); bán ra NHTM ~26.460 — chỉ còn cách trần biên độ ±5% (~26.517) khoảng 0,2%, rất sát trần giữa lúc xung đột Mỹ–Iran leo thang đẩy giá dầu và USD biến động mạnh. (Đã chỉnh lại chuỗi lịch sử 9–16/7 theo tỷ giá thị trường ValutaFX.com, thay cho dữ liệu cũ bị lặp trùng; 11–12/7 không có dữ liệu do cuối tuần.)",
      spark:[26270,26295,26267,26254,26264,26256,26254,26460,26460], cmp:{w:"+0,7%",m:"−0,2%",ytd:"+0,1%",yoy:"+0,6%"}},
    {n:"Tỷ giá kỳ hạn USD/VND (Forward 3M)", v:"~26.636", asOf:"17/07", freq:"Ngày", sig:"amber", note:"Bảng tỷ giá kỳ hạn USD/VND (17/07): kỳ hạn 3M Mua 159,12 / Bán 192,98 (Cao 190,39 / Thấp 183,32, T.đổi −12,91) ⇒ điểm kỳ hạn trung bình ~176,05đ + giao ngay liên NH 26.460 (17/07) ⇒ ~26.636 — hàm ý VND giảm thêm ~0,67% sau 3 tháng.",
      spark:[26488,26636], cmp:{}},
    {n:"USD/JPY", v:"162,1", asOf:"17/07", freq:"Ngày", sig:"amber", note:"Quanh 162 (giữa tháng 7) - yên tiếp tục chịu sức ép từ giá dầu tăng do xung đột Mỹ-Iran, dù phần nào được hỗ trợ bởi USD yếu sau lạm phát Mỹ hạ nhiệt.",
      spark:[159.5,160.2,161.0,162.6,162.0,161.6,162.08], cmp:{w:"+0,3%",m:"+1,1%",ytd:"—",yoy:"+9,7%"}},
    {n:"DXY (chỉ số USD)", v:"100,78", asOf:"17/07", freq:"Ngày", sig:"green", note:"Giảm nhẹ so tháng (-0,07%) nhưng tăng 2,33% so cùng kỳ năm trước; USD hạ nhiệt sau CPI Mỹ yếu hơn dự báo, dù áp lực dầu tăng do xung đột Mỹ-Iran có thể đảo chiều xu hướng.",
      spark:[102.8,102.4,102.0,101.6,101.3,100.5,100.9,100.97,100.78], cmp:{w:"−0,2%",m:"−0,07%",ytd:"—",yoy:"+2,33%"}},
    {n:"Dự trữ ngoại hối VN", v:"$87,6B", asOf:"18/06", freq:"Tháng", sig:"red", note:"87,6 tỷ USD ÷ NK bình quân 3 tháng gần nhất (T3–T5/26 ~50,0 tỷ USD/tháng) ≈ 1,75 tháng — dưới ngưỡng an toàn IMF (3 tháng NK bình quân, tương đương ~$150 tỷ ở mức NK hiện tại; đã cập nhật khỏi mốc tĩnh cũ $75B vì NK đã tăng ~33,4% yoy).",
      spark:[83.6,84.1,84.9,85.6,86.4,87.0,87.6], cmp:{w:"—",m:"+1,2%",ytd:"+4,8%",yoy:"+3,4%"}},
    {n:"Dòng vốn FII (khối ngoại)", v:"−15.306 tỷ đ", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Bán ròng 10/11 tháng gần đây (trừ T12/25 mua ròng nhẹ +1.698 tỷ) nhưng đã thu hẹp đáng kể từ đáy −30.096 tỷ (T8/25) — áp lực rút vốn khối ngoại dần dịu.",
      spark:[-30096,-26950,-24131,-8230,1698,-6702,-7837,-17474,-13433,-19585,-15306], cmp:{w:"—",m:"+4.279 tỷ",ytd:"đảo chiều từ mua ròng",yoy:"—"}}
  ],
  context:[
    {n:"Lãi suất điều hành SBV", v:"4,50%", asOf:"H1/26", freq:"Kỳ họp", sig:"green", note:"Giữ nguyên H1/2026 — ổn định mặt bằng lãi suất.", spark:[], cmp:{}},
    {n:"Cán cân TM (cung ngoại tệ)", v:"−2,6 tỷ USD", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Nhập siêu tạo áp lực cầu ngoại tệ lên VND.", spark:[], cmp:{}},
    {n:"FDI giải ngân (cung USD)", v:"$13,03B", asOf:"H1/26", freq:"Tháng", sig:"green", note:"+11,2% YoY, đỉnh 5 năm — nguồn cung USD dồi dào.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"neg", t:"VND chịu áp lực khi USD/VND liên ngân hàng áp sát trần biên độ (~26.460, cách trần 0,2%) giữa lúc xung đột Mỹ–Iran đẩy giá dầu tăng vọt và tâm lý trú ẩn USD trở lại."},
    {tone:"pos", t:"SBV giữ nguyên lãi suất điều hành; dự trữ ngoại hối ổn định ~$87,6B (18/06)."},
    {tone:"neg", t:"JPY yếu kéo dài quanh 162/USD gây sức ép lên biên lợi nhuận hợp đồng Nhật."}
  ]
},
{
  id:"demand", code:"B", ic:"🌐", name:"Cầu CNTT & AI", status:"cau", trend:"down",
  core:[
    {n:"Chi tiêu IT toàn cầu 2026", v:"$6,31T", asOf:"Q2/26", freq:"Quý", sig:"green", note:"Gartner nâng dự báo — nền cầu outsourcing mở rộng mạnh.",
      spark:[6.08,6.15,6.31], cmp:{w:"—",m:"—",ytd:"—",yoy:"+13,5%"}},
    {n:"Dự báo tăng trưởng IT năm", v:"+13,5%", asOf:"04/26", freq:"Quý", sig:"green", note:"Nâng từ +10,8% (T2) & +9,8% (T10/25) — động lực AI & data center.",
      spark:[9.8,10.8,13.5], cmp:{w:"—",m:"—",ytd:"+3,7đ",yoy:"+13,5%"}},
    {n:"PMI New Orders (ISM Mỹ / SX VN)", v:"56,0 / 51,8", asOf:"T6/26", freq:"Tháng", sig:"green", note:"Đơn hàng mới mở rộng 6 tháng liên tiếp (Mỹ); VN đơn hàng tăng.",
      spark:[52,53.5,54.8,55.5,56.8,56.0], cmp:{w:"—",m:"−0,8đ",ytd:"—",yoy:"↑"}},
    {n:"Cổ phiếu công nghệ (Nasdaq-100)", v:"28.593", asOf:"17/07", freq:"Ngày", sig:"red", note:"Giảm 2 phiên liên tiếp (-1,64% ngày 16/7, -1,50% ngày 17/7) còn 28.593 điểm khi nhóm công nghệ/AI chịu áp lực bán và căng thẳng Iran leo thang; YTD vẫn +13,2%.",
      spark:[29172,29253,29739,29831,29264,29592,29512,29028,28593], cmp:{w:"−4,2%",m:"−3,8%",ytd:"+13,2%",yoy:"↑"}},
    {n:"Chỉ số bán dẫn (VanEck SMH)", v:"$556,53", asOf:"17/07", freq:"Ngày", sig:"red", note:"Đảo chiều giảm mạnh sau khi lập đỉnh $590,77 (15/7, được TSMC & nhóm chip dẫn dắt) — giảm 2 phiên liên tiếp (-3,7% ngày 16/7, -2,18% ngày 17/7) còn $556,53 khi giới phân tích (BofA, MarketWatch) cảnh báo cổ phiếu bán dẫn tiến sát vùng thị trường gấu.",
      spark:[620.46,592.29,604.30,581.45,593.00,607.73,611.03,585.62,600.31,590.77,568.92,556.53], cmp:{w:"−8,9%",m:"−10,8%",ytd:"+54,5%",yoy:"↑"}},
    {n:"Hang Seng TECH Index (HSTECH)", v:"4.623", asOf:"17/07", freq:"Ngày", sig:"red", note:"Giảm 4,37% phiên 17/7 còn 4.623 điểm — bán tháo lan rộng nhóm công nghệ/AI Trung Quốc sau khi Z.ai lao dốc 28,5%, MiniMax giảm 15,6%, giữa lo ngại định giá nhóm AI quá cao.",
      spark:[4256,4393,4472,4454,4499,4541,4507,4711,4740,4623], cmp:{w:"—",m:"−1,0%",ytd:"—",yoy:"−9,2%"}}
  ],
  context:[
    {n:"Capex hyperscaler / data center", v:"+55,8%", asOf:"2026", freq:"Quý", sig:"green", note:"Chi data center $788B (Gartner) — cầu hạ tầng AI bùng nổ.", spark:[], cmp:{}},
    {n:"Thất nghiệp Mỹ (ngân sách khách)", v:"4,2%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Payroll chỉ +57k (yếu) — rủi ro khách siết ngân sách IT.", spark:[], cmp:{}},
    {n:"Nearshoring (cạnh tranh thị phần)", v:"theo dõi", asOf:"—", freq:"Quý", sig:"amber", flag:"manual", note:"Rủi ro VN mất thị phần vào LatAm/Đông Âu — nhập tay.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"pos", t:"Gartner nâng dự báo chi tiêu IT 2026 lên $6,31T (+13,5%); GenAI & data center dẫn dắt."},
    {tone:"pos", t:"AMD +130% YTD vượt Nvidia; Broadcom thắng thầu XPU cho Google, Meta, OpenAI."},
    {tone:"neg", t:"Cổ phiếu bán dẫn điều chỉnh khi dầu tăng; MS cảnh báo cầu AI có thể chững lại 2026."},
    {tone:"neg", t:"Thuế Section 232 25% với chip cao cấp (hiệu lực từ 15/01) đang rà soát mở rộng sang Phase 2 (từ 1/07) — rủi ro đẩy chi phí thiết bị AI/data center tăng thêm (ITIF)."}
  ]
},
{
  id:"rates", code:"C", ic:"🏦", name:"Lãi suất & Chi phí vốn", status:"cau", trend:"down",
  core:[
    {n:"Lãi suất chính sách Fed", v:"3,50–3,75%", asOf:"17/06", freq:"Kỳ họp", sig:"amber", note:"Giữ nguyên (họp 17/06); SEP cùng kỳ cho thấy dot plot đảo chiều hawkish, median cuối 2026 nâng lên 3,8% (từ 3,4%) — 9/18 thành viên dự báo tăng thêm lãi. Họp tiếp theo 28–29/07 dự kiến giữ nguyên. ECB nâng lên 2,25% (17/06); BOJ nâng lên 1,00% (16/06, cao nhất từ 1995).",
      spark:[3.75,3.75,3.63,3.63,3.63,3.63], cmp:{w:"—",m:"0đ",ytd:"—",yoy:"↓"}},
    {n:"Độ dốc đường cong 10Y−3M", v:"+0,70đ", asOf:"17/07", freq:"Ngày", sig:"green", note:"Dương +0,70 điểm % (17/07, từ +0,78 ngày trước) — đường cong dốc lên, chưa có tín hiệu đảo ngược (UST10Y 4,55-4,57%, 3M ~3,79%).",
      spark:[-0.15,-0.05,0.1,0.3,0.5,0.7,0.86,0.70], cmp:{w:"−0,16đ",m:"+0,3đ",ytd:"—",yoy:"↑"}},
    {n:"Lãi vay ngắn hạn VND (BQ)", v:"~6,5–9%", asOf:"Q2/26", freq:"Tháng", sig:"amber", flag:"manual", note:"SBV kêu gọi ổn định lãi suất cho vay — nhập tay.",
      spark:[], cmp:{}},
    {n:"Lãi vay liên NH qua đêm (VNIBOR O/N)", v:"4,68%", asOf:"09/07", freq:"Ngày", sig:"amber", note:"Hạ về 4,68% (09/07) từ đỉnh 6,62% (02/07) — thanh khoản dần dịu bớt sau đợt căng thẳng đầu tháng.",
      spark:[5.95,6.62,5.67,6.01,5.84,5.28,4.68], cmp:{w:"−1,94đ",m:"—",ytd:"—",yoy:"—"}},
    {n:"Tăng trưởng tín dụng VND", v:"+7,73%", asOf:"29/06", freq:"Tháng", sig:"green", note:"So đầu năm (từ 7,41% ngày 26/06); mục tiêu cả năm ~15%; +18,1% YoY — dòng vốn vào sản xuất.",
      spark:[1.2,2.1,3.0,3.9,5.1,6.3,7.41,7.73], cmp:{w:"+0,32đ",m:"↑",ytd:"+7,73%",yoy:"+18,1%"}}
  ],
  context:[
    {n:"Kỳ vọng Fed (thị trường)", v:"~1 lần tăng", asOf:"02/07", freq:"Kỳ họp", sig:"amber", note:"62% xác suất tăng tháng 9; effective 3,63%.", spark:[], cmp:{}},
    {n:"Kiểm soát tín dụng BĐS", v:"siết chặt", asOf:"H1/26", freq:"Quý", sig:"amber", note:"SBV siết dòng vốn vào BĐS đầu cơ.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"neg", t:"Fed SEP tháng 6 đảo chiều hawkish — 9/18 thành viên dự báo tăng thêm lãi, median cuối 2026 lên 3,8%; kỳ họp đầu tiên dưới tân Chủ tịch Fed Kevin Warsh."},
    {tone:"neg", t:"BOJ nâng lãi lên 1,00% (16/06) - cao nhất từ 1995; ECB nâng lên 2,25% (17/06), dự kiến giữ nguyên tại họp 23/07."},
    {tone:"pos", t:"Tín dụng VN tăng 7,73% từ đầu năm (29/06), đúng lộ trình so mục tiêu cả năm ~15%."}
  ]
},
{
  id:"trade", code:"D", ic:"🚢", name:"Thương mại", status:"cau", trend:"down",
  core:[
    {n:"Cán cân thương mại VN", v:"−2,6 tỷ USD", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Thu hẹp từ −5,2 tỷ USD (T5) nhưng H1 nhập siêu ~16,7 tỷ USD (đảo chiều từ xuất siêu ~8 tỷ USD cùng kỳ 2025) — XK 266,52 tỷ USD (+21% yoy), NK 283,17 tỷ USD (+33,4% yoy; nhập siêu từ Hàn Quốc +81%, Trung Quốc +39%).",
      spark:[-1.2,-2.8,-3.6,-4.2,-5.2,-2.6], cmp:{w:"—",m:"cải thiện",ytd:"−16,65 tỷ USD",yoy:"đảo chiều"}},
    {n:"FDI đăng ký & giải ngân", v:"$34,65B / $13,03B", asOf:"H1/26", freq:"Tháng", sig:"green", note:"Đăng ký +61% · giải ngân +11,2% (đỉnh 5 năm) — niềm tin nhà đầu tư.",
      spark:[], cmp:{w:"—",m:"—",ytd:"—",yoy:"+61%/+11%"}},
    {n:"PMI sản xuất VN", v:"51,8", asOf:"T6/26", freq:"Tháng", sig:"green", note:"12 tháng liên tiếp >50; sản lượng nhanh nhất từ T2.",
      spark:[49.5,50.0,50.6,51.0,52.8,51.8], cmp:{w:"—",m:"−1,0đ",ytd:"—",yoy:"↑"}},
    {n:"FDI đăng ký mới", v:"$17,39B", asOf:"H1/26", freq:"Tháng", sig:"green", note:"+87,2% YoY; 2.013 dự án mới — pipeline hạ tầng dồi dào.",
      spark:[], cmp:{w:"—",m:"—",ytd:"—",yoy:"+87,2%"}},
    {n:"Baltic Dry Index (cước khô)", v:"2.840", asOf:"16/07", freq:"Ngày", sig:"amber", note:"Giảm 3,5% trong tuần về 2.840 điểm (16/07, -3% phiên) sau khi lập đỉnh gần đây; supramax vẫn ở mức cao nhất từ 8/2022 (1.730đ), capesize giảm 5,6%.",
      spark:[2562,2650,2717,2797,2860,2910,2944,2840], cmp:{w:"−3,5%",m:"+7,9%",ytd:"↑",yoy:"+77%"}}
  ],
  context:[
    {n:"Cước container (Drewry WCI)", v:"$4.530/40ft", asOf:"02/07", freq:"Tuần", sig:"red", note:"+9% tuần; tuyến Vùng Vịnh +120–157% do Hormuz.", spark:[3600,3800,3950,4150,4530], cmp:{}},
    {n:"Chuỗi cung ứng / lead time chip", v:"gián đoạn", asOf:"07/26", freq:"Tháng", sig:"amber", flag:"manual", note:"Ảnh hưởng khủng hoảng Hormuz — nhập tay.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"neg", t:"H1/2026 nhập siêu ~16,7 tỷ USD (đảo chiều từ xuất siêu ~8 tỷ USD) do nhập khẩu tăng vọt 33,4% yoy."},
    {tone:"pos", t:"FDI giải ngân cao nhất 5 năm; Singapore (42%) dẫn đầu vốn đăng ký mới."},
    {tone:"neg", t:"Baltic Dry giảm nhẹ trong tuần (2.840đ) nhưng cước tuyến Trung Đông vẫn neo cao do Iran tấn công thêm 3 tàu chở dầu UAE giữa tháng 7."},
    {tone:"neg", t:"Thuế Section 232 25% với chip/bán dẫn (từ 15/01) rà soát mở rộng Phase 2 (1/07) — ITIF ước tính có thể giảm GDP Mỹ 3,9% trong 10 năm nếu duy trì."}
  ]
},
{
  id:"macro", code:"E", ic:"📊", name:"Lạm phát & Tăng trưởng", status:"cau", trend:"up",
  core:[
    {n:"CPI Mỹ (YoY)", v:"3,5%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Giảm mạnh về 3,5% yoy (T6, từ 4,2% T5) — MoM -0,4%, mức giảm tháng mạnh nhất từ 4/2020, chủ yếu do năng lượng giảm 5,7%. Core CPI 2,6% yoy (đi ngang MoM). Số liệu này là trước khi Brent tăng vọt do xung đột Hormuz giữa tháng 7 — CPI tháng 7 nhiều khả năng đảo chiều tăng.",
      spark:[3.1,3.3,3.4,3.6,3.8,4.2,3.5], cmp:{w:"—",m:"−0,4%",ytd:"↓",yoy:"3,5%"}},
    {n:"Tăng trưởng GDP Mỹ", v:"+2,1%", asOf:"Q1/26", freq:"Quý", sig:"green", note:"Ước tính cuối Q1; phục hồi từ +0,5% (Q4/25). GDP Q2/2026 công bố 30/07 — GDPNow (Atlanta Fed) dự báo ~3,0%, chuyên gia Philly Fed thận trọng hơn ~2,1%.",
      spark:[1.4,0.5,2.1], cmp:{w:"—",m:"—",ytd:"—",yoy:"+2,1%"}},
    {n:"Tăng trưởng GDP Việt Nam", v:"+8,39%", asOf:"Q2/26", freq:"Quý", sig:"green", note:"H1 +8,18%; cao nhất Q2 kể từ 2011 — động lực đầu tư & xuất khẩu.",
      spark:[7.09,7.55,7.94,8.39], cmp:{w:"—",m:"—",ytd:"+8,18%",yoy:"+8,39%"}},
    {n:"CPI Việt Nam (YoY)", v:"4,69%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Hạ từ 5,60% (T5) — thấp nhất từ T2/25; H1 bình quân +4,38%.",
      spark:[3.63,4.15,4.31,4.9,5.6,4.69], cmp:{w:"—",m:"−0,39%",ytd:"+4,38%",yoy:"4,69%"}},
    {n:"Tỷ lệ thất nghiệp Mỹ", v:"4,2%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Việc làm +57k (yếu); tỷ lệ tham gia LĐ giảm còn 61,5%.",
      spark:[4.0,4.1,4.2,4.1,4.2], cmp:{w:"—",m:"0đ",ytd:"↑",yoy:"↑"}},
    {n:"M2 Việt Nam", v:"19,82 triệu tỷ đ", asOf:"04/26", freq:"Tháng", sig:"amber", note:"+15,2% YoY — mở rộng nhanh hơn tăng trưởng GDP, cần theo dõi cùng áp lực lạm phát.",
      spark:[18.17331,18.362427,18.637799,18.728084,18.93826,19.444476,19.641068,19.635094,19.818534], cmp:{w:"—",m:"+0,93%",ytd:"+4,65%",yoy:"+15,2%"}}
  ],
  context:[
    {n:"Lõi CPI Mỹ / kỳ vọng LP", v:"2,6%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Hạ về 2,6% yoy (từ 2,9% T5), đi ngang MoM — giảm bớt lo ngại lạm phát dịch vụ dai dẳng, nhưng Fed vẫn nghiêng hawkish theo dot plot mới (median 3,8% cuối 2026).", spark:[], cmp:{}},
    {n:"Lương giờ Mỹ (AHE)", v:"+3,5% YoY", asOf:"T6/26", freq:"Tháng", sig:"green", note:"Hạ nhiệt danh nghĩa +3,5% yoy, nhưng lương thực tế (đã trừ lạm phát) chỉ +0,1% yoy — sức ép lạm phát tiền lương không đáng ngại.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"pos", t:"CPI Mỹ hạ mạnh về 3,5% yoy (T6, từ 4,2%) nhờ năng lượng giảm — nhưng xu hướng có thể đảo chiều khi Brent tăng vọt do xung đột Hormuz giữa tháng 7."},
    {tone:"pos", t:"GDP VN Q2 +8,39%, mục tiêu cả năm >10% dù rủi ro từ chiến tranh Iran."},
    {tone:"pos", t:"CPI VN hạ về 4,69% nhờ giá xăng dầu giảm — tạo dư địa ổn định vĩ mô, dù rủi ro đảo chiều tháng 7."}
  ]
},
{
  id:"hormuz", code:"F", ic:"🛢️", name:"Eo Hormuz", status:"risk", trend:"down",
  core:[
    {n:"Giá dầu Brent", v:"$88,10", asOf:"17/07", freq:"Ngày", sig:"amber", note:"Tăng vọt lên $88,10/thùng (17/07, +4,5% trong phiên từ $84,23) sau khi Mỹ không kích Iran trở lại đáp trả vụ tấn công 3 tàu chở dầu UAE — tuần tăng +15%, sát ngưỡng kích hoạt đỏ (+20%/tuần hoặc vượt $100). (Đã chỉnh lại chuỗi lịch sử 10–16/7 do bị lặp dữ liệu tuần trước: 10/7=$76,80, 14/7=$83,11 (giá mở cửa), 15/7≈$85,30, 16/7≈$84,22 — khớp với mức $84,23 nêu trên. 11–13/7 chưa tìm được số liệu đáng tin cậy nên bỏ trống thay vì đoán.)",
      spark:[73,74.6,76,76.8,83.11,85.3,84.22,88.1], cmp:{w:"+15,0%",m:"+8%",ytd:"↑",yoy:"↑"}},
    {n:"Giá xăng E10 RON95 VN", v:"20.550đ/l", asOf:"16/07", freq:"Kỳ 10 ngày", sig:"amber", note:"Đảo chiều tăng đúng như dự báo: kỳ điều hành 16/07 (15h, liên Bộ Công Thương–Tài chính) tăng 547đ/l lên tối đa 20.550đ/l do giá xăng dầu thế giới bật mạnh (Brent vọt lên ~$88) — chấm dứt chuỗi giảm từ đầu tháng 7.",
      spark:[22000,21500,21000,20600,20000,19300,20550], cmp:{w:"+6,5%",m:"−10%",ytd:"↓",yoy:"↓"}},
    {n:"CPI nhiên liệu VN (giao thông)", v:"+5,29%", asOf:"T6/26", freq:"Tháng", sig:"amber", note:"Hạ mạnh từ +12,48% (T5); xăng −10% MoM kéo CPI chung giảm — rủi ro đảo chiều tăng trong số liệu tháng 7 do Brent vọt lên ~$88 giữa tháng.",
      spark:[14,13,12.5,10,7,5.29], cmp:{w:"—",m:"−4,85%",ytd:"↓",yoy:"+5,29%"}},
    {n:"Lưu lượng tàu qua eo Hormuz", v:"10 tàu/ngày", asOf:"18/07", freq:"Ngày", sig:"red", note:"HormuzStraitMonitor (18/07, live): 10 tàu đang transit tại thời điểm ghi nhận (24h gần nhất: 12 lượt) — chỉ 11,4% mức bình thường ~60 tàu/ngày trước chiến tranh; giảm nhẹ so với 11 lượt ghi nhận 10/07. 444 tàu đang chờ qua eo (Tankers 180, Bulk Carriers 95, khác 169), +3 tàu chờ mới trong ngày — cho thấy ùn ứ tiếp tục tăng dù lượt transit giảm.",
      spark:[41,42,35,17,11,10], cmp:{w:"−9,1%",m:"↓",ytd:"↓",yoy:"↓"}},
    {n:"Lưu lượng dầu qua eo Hormuz", v:"~2,1 triệu thùng/ngày", asOf:"18/07", freq:"Ngày", sig:"red", note:"HormuzStraitMonitor (18/07, live) — Daily Throughput: 2,1 triệu / 10,3 triệu (trung bình bình thường), chỉ 20,4% mức bình thường trước chiến tranh. Lưu ý: đây là tổng trọng tải hàng hóa qua eo (DWT, gồm cả tankers, bulk carriers, tàu khác), không tách riêng dầu — dùng làm số liệu lưu lượng dầu gần đúng do site không công bố thùng dầu/ngày riêng.",
      spark:[1.5,2.1], cmp:{}},
    {n:"Cước VLCC & container Trung Đông", v:"~$368,9k/ngày", asOf:"17/07", freq:"Tuần", sig:"red", note:"Bật tăng trở lại sau khi Iran tấn công thêm 2 tàu (7/7) và IRGC tuyên bố phong tỏa Hormuz (12/7): TD3C (MEG–China, Baltic Exchange) từ WS345 (10/07, ~$344,3k/ngày) lên WS372 (17/07, ~$368,9k/ngày) — dưới đỉnh 6 năm $424k (T3) nhưng đã vượt xa mốc ~$200k đầu tháng 7; container Vùng Vịnh +120–157%. So đầu năm (09/01: WS74,17≈$55.540/ngày) và cùng kỳ 2025 (18/07/2025: WS53,2≈$32.978/ngày) — mức tăng chưa từng có.",
      spark:[80,110,150,200,320,424,200,344.25,368.9], cmp:{w:"+7,2%",m:"+84,5%",ytd:"+564%",yoy:"gấp ~11,2 lần"}},
    {n:"Phí bảo hiểm rủi ro chiến tranh", v:"~5% giá trị tàu", asOf:"17/07", freq:"Ngày", sig:"red", note:"Phí bảo hiểm chiến tranh cho tàu 100 triệu USD lên 3-10 triệu USD (~5% giá trị tàu, 17/07) — tăng 12-40 lần so mức ~250.000 USD trước xung đột, sau đợt Iran tấn công thêm 3 tàu chở dầu UAE giữa tháng 7. IMO khuyến cáo tránh eo Hormuz.",
      spark:[0.25,1,2,2,3.5,5], cmp:{w:"↑",m:"↑",ytd:"↑↑",yoy:"↑↑"}}
  ],
  context:[
    {n:"Giá dầu WTI", v:"$71,4", asOf:"12/07", freq:"Ngày", sig:"amber", note:"Tuần +~3,5%; risk premium do gián đoạn Hormuz.",
      spark:[67,68,69,70,71.2,72,71.4], cmp:{w:"+3,5%",m:"↑",ytd:"↑",yoy:"↑"}},
    {n:"Trạng thái kịch bản Hormuz", v:"ALERT", asOf:"17/07", freq:"Ngày", sig:"red", note:"Chiến tranh Iran tiếp diễn, leo thang thêm giữa tháng 7 sau vụ Iran tấn công 3 tàu chở dầu UAE — Mỹ tái áp trừng phạt dầu Iran và không kích trở lại, chấm dứt lệnh ngừng bắn trước đó.", spark:[], cmp:{}},
    {n:"Lộ trình Fed (higher-for-longer)", v:"hoãn cắt", asOf:"07/26", freq:"Kỳ họp", sig:"amber", note:"SEP tháng 6: dot plot đảo chiều hawkish, trung vị lãi suất cuối 2026 nâng lên 3,8% (từ 3,4%) — Fed nhiều khả năng giữ lãi cao lâu hơn do lạm phát năng lượng từ xung đột Hormuz.", spark:[], cmp:{}}
  ],
  news:[
    {tone:"neg", t:"Iran tấn công thêm 3 tàu chở dầu UAE giữa tháng 7 (1 thủy thủ thiệt mạng) — Mỹ tái áp trừng phạt dầu Iran và không kích trở lại, chấm dứt ngừng bắn trước đó."},
    {tone:"neg", t:"Brent vọt lên $88,10/thùng (+15% trong tuần, +4,5% riêng phiên 17/07) — sát ngưỡng kích hoạt đỏ."},
    {tone:"neg", t:"Phí bảo hiểm rủi ro chiến tranh tăng 12-40 lần; lưu lượng tàu qua Hormuz vẫn ở mức rất thấp so bình thường."}
  ]
}
] as const;

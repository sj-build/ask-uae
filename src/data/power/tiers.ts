import type { Person } from '@/types/person'
import type { Tier } from '@/types/tier'

const tierS: readonly Person[] = [
  {
    name: 'Sheikh Mohamed bin Zayed (MBZ)',
    nameAr: 'محمد بن زايد آل نهيان',
    title: 'UAE 대통령 · Abu Dhabi 통치자\nSandhurst 졸업, 군사전략가 출신',
    role: 'royal',
    tags: [{ label: '대통령', category: 'royal' }, { label: 'Abu Dhabi 통치자', category: 'royal' }],
    details: [
      '모든 최종 의사결정의 정점',
      '최측근: Khaldoon Al Mubarak (부친 암살 후 Zayed가 양자 수준으로 양육)',
      '외부 고문: Jim Mattis (前 미 국방장관), Richard Clarke (前 NSA 대테러 전문가)',
      '무슬림형제단 극도 경계 → 이집트/사우디와 공조',
    ],
    aum: '순자산 추정 ~$30B+ (개인/국가 경계 모호)',
  },
  {
    name: 'Sheikh Tahnoun bin Zayed',
    nameAr: 'طحنون بن زايد آل نهيان',
    title: '국가안보보좌관 · UAE 실질적 비즈니스 총괄\n"The Gatekeeper" — 기업제국의 설계자',
    role: 'royal',
    tags: [
      { label: '안보보좌관', category: 'royal' },
      { label: 'ADIA 의장', category: 'swf' },
      { label: 'ADQ/L\'imad', category: 'swf' },
      { label: 'G42 의장', category: 'tech' },
      { label: 'FAB 의장', category: 'bank' },
      { label: 'MGX', category: 'tech' },
    ],
    details: [
      'Royal Group (개인 지주사) → IHC 61% 지분 → $240B 시총',
      '핵심 참모: Sofia Lasky (모로코, ~30개 이사회), Syed Basar Shueb (IHC CEO)',
      'G42 → Peng Xiao (CEO, 前 DarkMatter/Pegasus)',
      'AED 스테이블코인 주도 (IHC + ADQ + FAB, 2025.4)',
      'Lulu Group 20% 인수 ($1B, ADQ 경유)',
    ],
    aum: '통제 자산 ~$1.5T (ADIA $1.18T + ADQ $263B + IHC $240B + FAB $330B + G42 + MGX)',
  },
  {
    name: 'Sheikh Mansour bin Zayed',
    nameAr: 'منصور بن زايد آل نهيان',
    title: '부통령 · 부총리 · 대통령실장\nMubadala 의장 · 소프트파워 총괄',
    role: 'royal',
    tags: [
      { label: '부통령', category: 'royal' },
      { label: 'Mubadala 의장', category: 'swf' },
      { label: 'ADNEC 의장', category: 'royal' },
    ],
    details: [
      'Abu Dhabi United Group (100% 개인 소유) → City Football Group (13개 구단, $6B+)',
      'Manchester City (2008 인수), Palmerston, Melbourne City 등',
      '부인: Sheikha Manal bint Mohammed (MBR 장녀) → Abu Dhabi-Dubai 가교',
      'Barclays 지분 (2008 금융위기 시 $3.5B 투자), Virgin Galactic 초기 투자자',
    ],
    aum: 'Mubadala $330B + ADUQ $6B+ (개인)',
  },
  {
    name: 'Sheikh Hazza bin Zayed',
    nameAr: 'هزاع بن زايد آل نهيان',
    title: '부 국가안보보좌관 · 스포츠/문화 포트폴리오',
    role: 'royal',
    tags: [
      { label: '안보 부보좌관', category: 'royal' },
      { label: '올림픽위원장', category: 'royal' },
    ],
    details: [
      'UAE 국가올림픽위원회 회장',
      'Al Ain FC 후원 (UAE 프로리그 명문)',
      '스포츠/문화 섹터 의사결정 영향력',
      'Tahnoun과 가장 가까운 형제로 알려짐',
    ],
  },
  {
    name: 'Sheikh Abdullah bin Zayed',
    nameAr: 'عبدالله بن زايد آل نهيان',
    title: '외교부 장관 · Abraham Accords 설계자',
    role: 'royal',
    tags: [{ label: '외교부 장관', category: 'royal' }],
    details: [
      '2020 Abraham Accords 서명 → 이스라엘 국교정상화 주도',
      'UAE 외교 전략의 핵심 인물',
      '대미/대중 균형외교 실행',
      '교육 부문 감독 (Abu Dhabi Education Council 전 의장)',
    ],
  },
  {
    name: 'Sheikh Khaled bin Mohamed',
    nameAr: 'خالد بن محمد بن زايد آل نهيان',
    title: 'Abu Dhabi 왕세자 (2023.3~) · MBZ 장남\n차세대 리더 · L\'imad Holding 의장',
    role: 'royal',
    tags: [
      { label: '왕세자', category: 'royal' },
      { label: 'L\'imad 의장', category: 'swf' },
      { label: 'ADIO 감독', category: 'swf' },
    ],
    details: [
      'L\'imad Holding (2026.1 출범): ADQ 자산 통합, ~$263B',
      'Khaldoon Al Mubarak이 L\'imad 이사회 참여 → 세대교체 연속성',
      'Abu Dhabi 집행위원회 의장',
      '디지털/AI/우주 산업 관심 → Hub71, ADIO 직접 감독',
    ],
    aum: 'L\'imad ~$263B (ADQ 통합)',
  },
] as const

const tierA: readonly Person[] = [
  {
    name: 'Sheikh Mohammed bin Rashid (MBR)',
    nameAr: 'محمد بن راشد آل مكتوم',
    title: 'UAE 부통령 겸 총리 · Dubai 통치자\nDubai Inc. 설계자 · Godolphin 오너',
    role: 'royal',
    tags: [
      { label: '총리/부통령', category: 'royal' },
      { label: 'Dubai 통치자', category: 'royal' },
    ],
    details: [
      'Dubai Holding (~$72B AUM): HSBC, Sony 지분, 글로벌 부동산',
      'Godolphin: 전 세계 ~1,000마리 경주마, 5,000+승, 글로벌 5개국 운영',
      '2009 Dubai 부채위기 ($80-100B) → Abu Dhabi $25B 구제금융 → 사실상 연방 내 Abu Dhabi 종속',
      '순자산 추정 $4-18B (국가/개인 경계 불명확)',
    ],
    aum: 'Dubai Inc. 총 자산 ~$500B+',
  },
  {
    name: 'Sheikh Hamdan bin Mohammed (Fazza)',
    nameAr: 'حمدان بن محمد بن راشد آل مكتوم',
    title: 'Dubai 왕세자 · 부총리 (2024.7~)\nInstagram 1,700만 팔로워 · 소프트파워 아이콘',
    role: 'royal',
    tags: [
      { label: '왕세자', category: 'royal' },
      { label: 'ICD 의장', category: 'swf' },
      { label: '집행위 의장', category: 'royal' },
    ],
    details: [
      'ICD (Investment Corporation of Dubai): ~$429B 자산, Emirates/DEWA/Emaar 등',
      'Dubai 10X Initiative: "10년 선도 도시" 프로젝트',
      'D33 Economic Agenda: 2033년까지 유니콘 30개 목표',
      'SNS 팔로워수가 UAE 인구(~1,000만)를 초과 → 글로벌 브랜딩 자산',
    ],
    aum: 'ICD ~$429B',
  },
  {
    name: 'Sheikh Ahmed bin Saeed Al Maktoum',
    nameAr: 'أحمد بن سعيد آل مكتوم',
    title: 'MBR의 숙부 · Dubai 최고 운영 책임자\nEmirates/flydubai/Dubai Airports 의장',
    role: 'royal',
    tags: [
      { label: 'Emirates 의장', category: 'energy' },
      { label: 'Emirates NBD', category: 'bank' },
      { label: 'Dubai World', category: 'royal' },
    ],
    details: [
      '동시 의장직: Emirates, flydubai, Dubai Airports, Dubai Holding, Dubai World, Emirates NBD',
      '2009 부채위기 시 Supreme Fiscal Committee 의장으로 구조조정 총괄',
      'Dubai 경제 인프라의 실질적 운영 최고 책임자',
      'DIFC(Dubai 국제금융센터) 의장',
    ],
  },
] as const

const tierB: readonly Person[] = [
  {
    name: 'Khaldoon Al Mubarak',
    title: 'Mubadala CEO · MBZ 최측근 비왕족\n"Abu Dhabi\'s Shadow Foreign Minister"',
    role: 'exec',
    tags: [
      { label: 'Mubadala CEO', category: 'swf' },
      { label: 'G42 이사', category: 'tech' },
      { label: 'MGX 부의장', category: 'swf' },
      { label: 'ADNOC 이사', category: 'energy' },
      { label: 'L\'imad 이사', category: 'swf' },
    ],
    details: [
      '부친(주불 UAE 대사) 1984년 Abu Nidal 테러로 암살 → Sheikh Zayed가 양자 수준으로 양육',
      'Tufts 대학 졸, 21세에 ADNOC 입사, Dolphin Energy 거쳐 부상',
      'F1 Abu Dhabi GP 유치, Manchester City 의장 (2008~)',
      '모든 주요 SWF에 이사회 참여 → Abu Dhabi 투자생태계의 유일한 교차점',
    ],
    aum: 'Mubadala $330B CEO · 5개+ 주요 이사회',
  },
  {
    name: 'Dr. Sultan Ahmed Al Jaber',
    title: 'ADNOC CEO · COP28 의장 · Masdar 창립자\n에너지→기후 전환의 상징',
    role: 'exec',
    tags: [
      { label: 'ADNOC CEO', category: 'energy' },
      { label: 'Masdar 의장', category: 'energy' },
      { label: 'XRG', category: 'energy' },
    ],
    details: [
      '화학공학 (USC), PhD (Coventry) → 기술관료형 경력',
      '2006 Masdar(재생에너지) 창립 → 성공 후 2016 ADNOC CEO 발탁',
      'COP28 의장: 석유회사 CEO 최초 → 논란 속 UAE 글로벌 위상 제고',
      'XRG ($80B+ 기업가치) 출범: ADNOC 저탄소 에너지 스핀오프',
      '한국 $30B+ 계약 감독 (KEPCO 원전, 삼성엔지니어링 등)',
    ],
    aum: 'ADNOC $49.7B 매출 (2024)',
  },
  {
    name: 'Peng Xiao (彭肖)',
    title: 'G42 CEO · 前 DarkMatter/Pegasus 대표\n중국계 미국인 → UAE 시민권 취득',
    role: 'exec',
    tags: [
      { label: 'G42 CEO', category: 'tech' },
      { label: '前 DarkMatter', category: 'defense' },
      { label: 'AI/사이버', category: 'tech' },
    ],
    details: [
      '하얼빈 출생, 중국계 미국인 → 미국 시민권 포기, UAE 귀화',
      'DarkMatter 자회사 Pegasus 대표 → Project Raven (NSA/CIA 출신 사이버 요원 운용)',
      'CIA가 별도 프로파일 작성, 미 의회 조사관 "이중용도 기술 네트워크" 지적',
      'Microsoft $1.5B 투자 유치, OpenAI Stargate 파트너십 체결',
      'Sheikh Tahnoun이 직접 선택 → 안보+기술 브릿지 역할',
    ],
    aum: 'G42: 직원 24,000명, 7개 자회사',
  },
  {
    name: 'Syed Basar Shueb',
    title: 'IHC CEO · Royal Group에서 성장한 엔지니어\nIHC $240B 신화의 실행자',
    role: 'exec',
    tags: [
      { label: 'IHC CEO', category: 'tech' },
      { label: 'Royal Group 출신', category: 'royal' },
    ],
    details: [
      '파키스탄 출신 네트워크 엔지니어, 1998년 Royal Group 입사',
      '2001년 PAL Technology 공동설립',
      '2020 Sheikh Tahnoun IHC 의장 취임 시 CEO 발탁',
      'IHC 시총: 700M AED (2019) → $240B (2024) = 42,000% 성장',
      'Royal Group 40+개 기업을 IHC로 이전 (다수 1 디르함에), 이익 전액 재투자',
    ],
    aum: 'IHC: 1,400+ 자회사, AED 92.8B 매출',
  },
  {
    name: 'Mohamed Hassan Alsuwaidi',
    title: '前 ADQ CEO → Lunate Executive Chairman\n크립토 친화적 sovereign-adjacent 투자자',
    role: 'exec',
    tags: [
      { label: 'Lunate 의장', category: 'swf' },
      { label: '前 ADQ CEO', category: 'swf' },
    ],
    details: [
      'ADQ CEO로서 $263B 자산 관리, L\'imad 출범 전 전환',
      'Lunate: $115B AUM, IHC/Chimera + ADQ 대체투자 관리',
      '"스테이블코인은 UAE 디지털 인프라의 중추적 전환점" 발언 → 크립토 우호적',
      '한국 투자자 접점: sovereign-adjacent + 크립토 이해 + 접근 가능한 규모',
    ],
    aum: 'Lunate $115B AUM',
  },
  {
    name: 'Ahmed Yahia Al Idrissi',
    title: 'MGX CEO · 前 McKinsey Abu Dhabi MP\nAI 투자 전문 ($100B 목표 AUM)',
    role: 'exec',
    tags: [
      { label: 'MGX CEO', category: 'tech' },
      { label: '前 Mubadala PE', category: 'swf' },
    ],
    details: [
      'McKinsey 9년 (Abu Dhabi Managing Partner) → Mubadala PE → MGX CEO',
      'MGX: Binance $2B 지분, OpenAI $6.6B, xAI $6B+$20B, Anthropic $3.5B, Databricks $10B',
      'Stargate Project ~$7B 기여 ($500B 총 규모)',
      'AMD 이사회 멤버',
      '최소 LP: $500M (소규모 펀드 직접 접근 어려움)',
    ],
    aum: 'MGX $50B+ 배치, 목표 $100B AUM',
  },
  {
    name: 'Faisal Al Bannai',
    title: 'EDGE Group 의장 · ATRC 사무총장\n前 DarkMatter 설립자 → 방위산업 총괄',
    role: 'exec',
    tags: [
      { label: 'EDGE 의장', category: 'defense' },
      { label: '前 DarkMatter', category: 'defense' },
      { label: 'ATRC', category: 'tech' },
    ],
    details: [
      'Dubai 경찰 소장의 아들, DarkMatter 설립 (2014/15)',
      'DarkMatter 매각 후 EDGE Group ($5B 방위산업 그룹, 세계 22위) 의장',
      '장관급 대통령 고문 + Advanced Technology Research Council 사무총장',
      '안보→방위산업→기술투자 파이프라인의 원형',
    ],
    aum: 'EDGE Group $5B 매출',
  },
] as const

const tierC: readonly Person[] = [
  {
    name: 'Khalaf Al Habtoor',
    title: 'Al Habtoor Group 의장\nMBR 어린시절 친구 → 60년 관계',
    role: 'family',
    tags: [
      { label: '호텔 14개', category: 'retail' },
      { label: '자동차 (Bentley/Bugatti)', category: 'retail' },
      { label: 'MBR 최측근', category: 'royal' },
    ],
    details: [
      '부친이 어린 시절 Sheikh Rashid 왕궁에 소개 → MBR과 동년배 친구',
      '1977 Sheikh Rashid로부터 UAE 두 번째 병원 건설계약 수주',
      'Al Habtoor City ($3B 개발), 럭셔리카 독점 (Bentley, McLaren, Bugatti)',
      '정치 발언 유일한 재벌: 이스라엘-UAE 수교 사전 지지, 사우디 옹호',
    ],
    aum: 'Al Habtoor Group 매출 $3-5B',
  },
  {
    name: 'Al Futtaim / Majid Al Futtaim (분리)',
    title: '1930년대 진주교역 → 1992년 형제 분쟁 → MBR 중재',
    role: 'family',
    tags: [
      { label: 'Toyota/Lexus', category: 'retail' },
      { label: 'IKEA/Carrefour', category: 'retail' },
      { label: 'MBR 중재', category: 'royal' },
    ],
    details: [
      'Al Futtaim: Toyota/Lexus/Honda (1955~), IKEA, Festival City → $5B+',
      'Majid Al Futtaim: Carrefour MENA 독점, Mall of Emirates, VOX Cinemas → AED 33.9B',
      '2000년 MBR이 직접 중재하여 사업 분할',
      'Majid 사망 (2021) 시 MBR이 "가장 중요한 상인" 추도 + 특별 상속 사법위원회 구성',
    ],
    aum: '양사 합산 매출 ~$14B',
  },
  {
    name: 'Al Ghurair Family',
    title: 'Mashreq Bank (UAE 최대 민영은행) · UAE 최고 자산가',
    role: 'family',
    tags: [
      { label: 'Mashreq Bank', category: 'bank' },
      { label: '쇼핑몰/제분', category: 'retail' },
      { label: 'FNC 의장 배출', category: 'royal' },
    ],
    details: [
      'Abdul Aziz Al Ghurair: UAE 연방국민의회(FNC) 의장 (2007-11) — 상인 가문 유일 정치직',
      'Mashreq Bank: 지분 72.75%, AED 9.01B 이익 (2024)',
      'Al Ghurair Centre: 걸프 최초 쇼핑몰',
      'Abdulla Al Ghurair: UAE 최고 자산가 ($4.8B)',
    ],
    aum: '가문 순자산 ~$4.8B',
  },
  {
    name: 'Chalhoub Group (Patrick & Michel Jr.)',
    title: 'GCC 럭셔리 유통 독점 — LVMH, Chanel, Dior 독점권',
    role: 'family',
    tags: [
      { label: '럭셔리 유통', category: 'retail' },
      { label: 'Sephora/L\'Oreal', category: 'retail' },
    ],
    details: [
      '시리아-레바논 출신 Michel Chalhoub이 1960~70년대 직접 셰이크들에게 납품하며 관계 구축',
      '1980년대 쿠웨이트에서 Louis Vuitton/Chanel 최초 계약 → 선점 효과',
      '현재 700+ 리테일 매장, 400+ 브랜드, GCC 럭셔리 시장 20-25% 장악',
      'K-Beauty/K-Fashion UAE 진출 시 반드시 만나야 할 파트너',
    ],
    aum: '매출 $3-5B · 직원 14,000-16,000',
  },
  {
    name: 'M.A. Yusuff Ali (Lulu Group)',
    title: '인도 출신 · UAE 리테일 왕 · 왕족 직접 접근 가능',
    role: 'family',
    tags: [
      { label: 'Lulu 259개점', category: 'retail' },
      { label: 'Tahnoun 20% 투자', category: 'royal' },
    ],
    details: [
      '1973년 16세에 Abu Dhabi 도착, 삼촌 유통 사업 합류',
      'Sheikh Tahnoun이 ADQ 통해 20% 인수 ($1B, 2020)',
      'Abu Dhabi Award (민간 최고 훈장) 수훈, MBZ 직접 수여',
      '2021 헬기 사고 시 Abu Dhabi 왕실이 의료후송 전용기 배치',
      '외국인 투자자 소개 중개자 역할 공식화 (인도 비즈니스 그룹 의장)',
    ],
    aum: 'Lulu $8.4B 매출 · 2024 ADX 상장',
  },
  {
    name: 'Al Tayer Group',
    title: '럭셔리 리테일 + 자동차 유통 · $8B 매출',
    role: 'family',
    tags: [
      { label: 'Harvey Nichols', category: 'retail' },
      { label: 'Ferrari/Maserati', category: 'retail' },
    ],
    details: [
      'Harvey Nichols, Bloomingdale\'s, Armani, Prada UAE 독점 유통',
      'Ferrari, Maserati, Jaguar, Land Rover 딜러',
      'Obaid Al Tayer: 前 재정부 장관 (2014-2021) → 정부-상업 회전문',
      'DFS Galeria (Dubai Mall, Abu Dhabi Mall) 운영',
    ],
    aum: '매출 ~$8B',
  },
] as const

export const tiers: readonly Tier[] = [
  {
    level: 'S',
    label: '최고 의사결정권자 — Al Nahyan Bani Fatima 6형제',
    subtitle: 'Sheikha Fatima 소생, UAE 총 자산의 ~80% 통제',
    defaultOpen: true,
    persons: tierS,
  },
  {
    level: 'A',
    label: 'Dubai 통치가문 — Al Maktoum Family',
    subtitle: 'Dubai Holding $72B · ICD $429B · Emirates Group',
    persons: tierA,
  },
  {
    level: 'B',
    label: '비왕족 핵심 실권자 — CEO/의장급 신뢰받는 실행자',
    subtitle: '왕족의 뜻을 실행하는 핵심 인물들. 이들을 통해 실제 딜이 성사된다.',
    persons: tierB,
  },
  {
    level: 'C',
    label: '상업 가문 — 수십 년 왕족 관계로 성장한 재벌그룹',
    subtitle: '유통, 럭셔리, 부동산, 식품에서 UAE 소비경제 지배',
    persons: tierC,
  },
] as const

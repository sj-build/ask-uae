export interface InitiativeData {
  readonly icon: string
  readonly title: string
  readonly titleColor: string
  readonly subtitle: string
  readonly content: string
}

export const initiatives: readonly InitiativeData[] = [
  {
    icon: '🧠', title: 'AI / 데이터센터 — #1 국가 어젠다', titleColor: '#a78bfa',
    subtitle: 'National AI Strategy 2031 | Stargate UAE',
    content: '<b style="color:#a78bfa">핵심 목표:</b> 2031년까지 세계 AI 리더, 정부 서비스 100% AI 통합<br><br><b>🔑 메가 프로젝트:</b><br>• <b>Stargate UAE:</b> 5GW AI 캠퍼스, 10평방마일 — <b>미국 외 최대</b><br>  → G42 + OpenAI + Oracle + SoftBank + Nvidia 합작<br>  → 1단계 200MW 2026년 가동, 원자력+태양광+가스 전원<br>• <b>Microsoft $15.2B:</b> 4년간 AI/클라우드 인프라 투자<br>• <b>Abu Dhabi 디지털 전략 2025-27:</b> AED 13B 투자<br>  → 세계 최초 AI-native 정부 목표, GDP AED 24B 기여 전망<br><br><b style="color:#c8a44e">K-기회:</b> 한국 반도체/냉각 기술, AI 스타트업 UAE 진출 지원',
  },
  {
    icon: '⚡', title: '에너지 전환 — 탈석유 + 원자력 + 신재생', titleColor: '#f59e0b',
    subtitle: 'UAE Energy Strategy 2050 | Net Zero 2050',
    content: '<b style="color:#f59e0b">핵심 목표:</b> 2050년까지 탄소중립, 재생에너지 3배 확대<br><br><b>🔑 주요 사업:</b><br>• <b>Barakah 원전:</b> 5.6GW 완전 가동 — <b>KEPCO 건설</b> 🇰🇷<br>• <b>Masdar:</b> 50GW 신재생에너지 포트폴리오 (2030 목표)<br>• <b>XRG:</b> ADNOC의 에너지 트랜지션 자회사 ($80B+ 기업가치)<br>• <b>수소:</b> 녹색수소 전략 (2031 목표 1.4MTPA)<br>• <b>Al Dhafra 태양광:</b> 2GW — 세계 최대 단일 태양광 프로젝트<br><br><b>투자 규모:</b> AED 150~200B (2030년까지)<br><br><b style="color:#c8a44e">K-기회:</b> KEPCO 관계를 레버리지, 한국 원전/수소 기술 연계',
  },
  {
    icon: '🏗️', title: 'We the UAE 2031 / D33', titleColor: '#4a9eff',
    subtitle: '국가비전 | Dubai Economic Agenda',
    content: '<b style="color:#4a9eff">We the UAE 2031:</b><br>• GDP AED 1.78T → <b>AED 3T으로 2배</b> (10년 내)<br>• 비석유 수출 $410B 달성<br>• 우주, 디지털 엔터테인먼트 등 신산업 육성<br>• 유니콘 기업 30개 배출 목표<br><br><b style="color:#4a9eff">Dubai D33 (2033):</b><br>• Dubai 경제 규모 2배<br>• 대외무역 AED 25.6T<br>• 400개 신규 교역 도시 추가<br>• 100개 혁신 프로젝트<br><br><b style="color:#4a9eff">Abu Dhabi Liveability Strategy:</b><br>• <b>AED 42B</b> 추가 투자 (2025.9 승인)<br>• 200+ 공원, 24개 학교, 120km 보행로<br>• 주거지 통합도 67% → 81% 달성',
  },
  {
    icon: '🎰', title: '상업 도박 합법화 — 게임 체인저', titleColor: '#ef4444',
    subtitle: 'Wynn Al Marjan Island | GCGRA',
    content: '<b style="color:#ef4444">혁명적 변화:</b> 이슬람 국가에서 <b>최초 합법 카지노</b><br><br><b>🔑 현황:</b><br>• <b>Wynn Al Marjan Island:</b> Ras Al Khaimah, $3.9B 투자<br>  → 1,500실, 22개 레스토랑, 극장, 게이밍 시설<br>  → <b>$2.4B 대출</b> — UAE 역사상 최대 호스피탈리티 파이낸싱<br>  → 2026년 오픈 예정<br>• GCGRA (게이밍규제청) 2023년 설립<br>• 14개 벤더 라이센스 승인 (Aristocrat, IGT 등)<br>• <b>암호화폐 결제 도입 계획</b><br><br><b>시장 규모:</b> Bloomberg 추산 UAE 카지노 연간 GGR $6~8B<br><br><b style="color:#c8a44e">K-기회:</b> 한국 IR 경험 (파라다이스시티), 게이밍 기술 수출',
  },
  {
    icon: '💰', title: '디지털 자산 / 스테이블코인', titleColor: '#22d3ee',
    subtitle: 'VARA | AED Stablecoin | Phoenix Group',
    content: '<b style="color:#22d3ee">UAE = 글로벌 크립토 수도 자처:</b><br><br>• <b>VARA (Dubai):</b> 세계 최초 독립 가상자산규제청<br>• <b>ADGM (Abu Dhabi):</b> 포괄적 디지털자산 프레임워크<br>• <b>Binance HQ:</b> Dubai에 글로벌 본사 설립 (VARA 라이센스)<br>• <b>AED Stablecoin:</b> IHC + ADQ + FAB 합작 $120M — <b>국영 스테이블코인</b><br>• <b>Phoenix Group:</b> IHC 산하, ADX 상장 크립토 마이닝<br>• <b>MGX $2B → Binance:</b> 사상 최대 크립토 기업 투자<br><br><b>SWF 크립토 배치 (2024~25):</b><br>• ADIA $436M 비트코인 ETF<br>• Mubadala $437M 비트코인 ETF<br>• 합산 $4B+ (개별 투자), but <b>크립토 펀드 LP = $0</b><br><br><b style="color:#c8a44e">투자자 시사점:</b> 국가가 크립토에 올인. 그런데 크립토 펀드에 LP 투자한 적은 없음 → 우리가 first mover 될 기회',
  },
  {
    icon: '👨‍👩‍👧‍👦', title: '사회 정책 — 에미라티화 + 가족의 해', titleColor: '#34d399',
    subtitle: 'Emiratisation | 2026 Year of the Family | Nafis',
    content: '<b style="color:#34d399">에미라티화 (Emiratisation):</b><br>• 50인+ 기업: 연 2%씩 에미라티 의무고용 확대<br>• 2026년 목표: 10% 에미라티 비율<br>• 20~49인 기업도 14개 핵심 산업 의무 적용<br>• Nafis 프로그램: 훈련+인센티브+경력 상담<br>• 미달성시 기업당 AED 96,000/인 벌금<br><br><b style="color:#34d399">2026 "가족의 해" (Year of the Family):</b><br>• MBZ 직접 지정 — 가족 결속, 출산 장려<br>• Ministry of Family Strategy 2025~2027<br>• 국가 가족성장 어젠다 2031<br>• 출산/육아/정신건강 통합 지원 확대<br><br><b style="color:#34d399">신규 법률 (2026 시행):</b><br>• 회사법 개정: 복수의결권 주식 허용<br>• 설탕세 도입 (공중보건)<br>• 규제 투명성/책임 강화<br><br><b style="color:#c8a44e">K-기회:</b> 한국 에듀테크, K-뷰티 (가족 중심 마케팅), 출산/육아 기술',
  },
] as const

export interface GovernanceItem {
  readonly title: string
  readonly description: string
}

export const governanceConcepts: readonly GovernanceItem[] = [
  { title: 'Majlis (마즐리스)', description: '통치자가 시민을 직접 만나는 열린 청원 회의. 왕족 접근의 핵심 통로.' },
  { title: 'Wasta (와스타)', description: '인맥/영향력. Mojamala(상호성), Hamola(빚진 호의), Somah(쌓인 신뢰). "신뢰 없이 거래 없다."' },
  { title: 'Emiratisation', description: '자국민 고용 의무. 민간 50인+ 기업 → 에미라티 2%+ 의무 (매년 확대 중)' },
  { title: 'Free Zones (45개+)', description: '외국인 100% 소유, 0% 관세. ADGM/DIFC(금융), DMCC(무역), Hub71(스타트업)' },
  { title: 'Golden Visa', description: '10년 장기비자. 투자자 $545K+, 전문인력, 예술가 대상. 15만+ 발급.' },
] as const

export const koreanDifferences: readonly GovernanceItem[] = [
  { title: '정교분리 없음', description: '이슬람 국교. 샤리아법 일부 적용(가족법/상속). ADGM/DIFC는 영미법 가능.' },
  { title: '이중 권력구조', description: '연방법 vs 에미리트 자치법 병존. Dubai 합법 ≠ Sharjah 합법 (주류 등)' },
  { title: 'PEP 구조 상이', description: '왕족/정부인사 사업 보유 = 정상. 한국식 이해충돌 개념 부재. 배우자 명의 시장 표준.' },
  { title: '계약 문화', description: '서양보다 간소한 계약. 신뢰·구두 합의 선호. 관계 없이 법적 보호만 의지하면 한계.' },
  { title: '표현의 자유 제한', description: '왕실/종교/정부 비판 불가. SNS 포스팅도 법적 처벌 대상. 극도로 조심.' },
] as const

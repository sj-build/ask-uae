import { ConnBox } from '@/components/ui/ConnBox'

export function GovernmentStructure() {
  return (
    <ConnBox title="🏛️ UAE 정부 구조 전체도 — 연방 vs 지방의 이원화" className="mb-6">
      <pre className="text-[11px] leading-relaxed overflow-x-auto whitespace-pre font-mono">
        <span className="text-gold font-bold">UAE 정부 (Federal Government)</span>
        <span className="text-t3"> — 외교, 국방, 이민, 화폐, 연방 법률</span>
        {'\n'}
        ├─ <span className="text-gold">대통령 (President)</span>
        <span className="text-t3"> — Abu Dhabi 통치자 자동 취임</span>
        {'\n'}
        ├─ <span className="text-gold">부통령 겸 총리 (Vice President & PM)</span>
        <span className="text-t3"> — Dubai 통치자 자동 취임</span>
        {'\n'}
        ├─ <span className="text-accent-blue">최고연방위원회 (FSC: Federal Supreme Council)</span>
        {'\n'}
        │   <span className="text-t3">— 7명의 통치자로 구성, UAE 최고 의사결정 기구</span>
        {'\n'}
        │   <span className="text-t3">— 연방 법률, 예산, 조약 승인, 장관 임명</span>
        {'\n'}
        │   <span className="text-accent-red">— Abu Dhabi + Dubai는 거부권 보유</span>
        {'\n'}
        ├─ <span className="text-accent-green">연방국가평의회 (FNC: Federal National Council)</span>
        {'\n'}
        │   <span className="text-t3">— 40명 (20명 임명, 20명 간선)</span>
        {'\n'}
        │   <span className="text-t3">— 자문 기능만, 법률 거부권 없음</span>
        {'\n'}
        └─ <span className="text-accent-orange">각료회의 (Cabinet)</span>
        {'\n'}
            <span className="text-t3">— 총리가 장관 임명 (FSC 승인 필요)</span>
        {'\n'}
            <span className="text-t3">— 외교부, 국방부, 재무부, 내무부, 경제부 등</span>
        {'\n\n'}
        <span className="text-gold font-bold">Emirate 정부 (Local Government)</span>
        <span className="text-t3"> — 부동산, 경찰, 보건, 교육, 상업, 관광</span>
        {'\n'}
        ├─ <span className="text-gold">Abu Dhabi</span>
        {'\n'}
        │   ├─ <span className="text-accent-blue">통치자 (Ruler)</span>
        <span className="text-t3"> — 자동으로 UAE 대통령</span>
        {'\n'}
        │   ├─ <span className="text-accent-blue">왕세자 (Crown Prince)</span>
        <span className="text-t3"> — 실질적 총괄 책임자</span>
        {'\n'}
        │   ├─ <span className="text-t3">각종 왕족 위원회 (Executive Council, Investment Office 등)</span>
        {'\n'}
        │   └─ <span className="text-accent-orange">각 부서</span>
        <span className="text-t3"> — 경제청, 교육청, 보건청, 관광청, 경찰 등</span>
        {'\n'}
        ├─ <span className="text-gold">Dubai</span>
        {'\n'}
        │   ├─ <span className="text-accent-blue">통치자 (Ruler)</span>
        <span className="text-t3"> — 자동으로 UAE 부통령 겸 총리</span>
        {'\n'}
        │   ├─ <span className="text-accent-blue">왕세자 (Crown Prince)</span>
        {'\n'}
        │   ├─ <span className="text-t3">각종 왕족 위원회 (Executive Council, DIFC, DWTC 등)</span>
        {'\n'}
        │   └─ <span className="text-accent-orange">각 부서</span>
        <span className="text-t3"> — 경제청, 관광청, 경찰, 토지청 등</span>
        {'\n'}
        └─ <span className="text-t3">...기타 5개 에미리트 (각각 독자 통치 구조)</span>
        {'\n\n'}
        <span className="text-gold font-bold">핵심:</span>
        <span className="text-t2"> 연방 정부는 외교/국방만, 실생활은 에미리트 정부가 관할</span>
        {'\n'}
        <span className="text-accent-red">→ 비즈니스는 연방 법률 + 에미리트 규정 둘 다 확인 필수</span>
      </pre>
    </ConnBox>
  )
}

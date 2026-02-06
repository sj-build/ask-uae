export interface DifferenceItem {
  readonly id: string
  readonly icon: string
  readonly title: string
  readonly uae: {
    readonly label: string
    readonly description: string
    readonly detail: string
  }
  readonly korea: {
    readonly label: string
    readonly description: string
    readonly detail: string
  }
  readonly businessTip: string
}

export const mustKnowDifferences: readonly DifferenceItem[] = [
  {
    id: 'decision-making',
    icon: '\u{1F3DB}',
    title: '\uC758\uC0AC\uACB0\uC815 \uAD6C\uC870',
    uae: {
      label: '\uD0D1\uB2E4\uC6B4 (Top-Down)',
      description: '\uC655\uAC00/\uC815\uBD80 \uC9C0\uC2DC\uB85C \uBE60\uB978 \uACB0\uC815',
      detail: '\uD1B5\uCE58\uC790\uC758 \uBE44\uC804\uC774 \uACE7 \uAD6D\uAC00 \uC804\uB7B5. MBZ\uC758 \uACB0\uC815 = \uC989\uC2DC \uC2E4\uD589. \uC911\uAC04 \uD611\uC758 \uACFC\uC815 \uCD5C\uC18C\uD654.',
    },
    korea: {
      label: '\uBCF4\uD140\uC5C5 (\uD569\uC758\uC81C)',
      description: '\uB2E4\uCE35 \uD611\uC758\uC640 \uD569\uC758 \uACFC\uC815 \uD544\uC218',
      detail: '\uC774\uC0AC\uD68C, \uACBD\uC601\uC9C4, \uC2E4\uBB34\uC790 \uB2E8\uACC4\uBCC4 \uBCF4\uACE0\uC640 \uC2B9\uC778. \uC758\uC0AC\uACB0\uC815\uAE4C\uC9C0 \uC218\uAC1C\uC6D4 \uC18C\uC694.',
    },
    businessTip: 'UAE\uC5D0\uC11C\uB294 \uACB0\uC815\uAD8C\uC790\uC640\uC758 \uC9C1\uC811 \uAD00\uACC4\uAC00 \uACE7 \uC0AC\uC5C5 \uC131\uD328\uB97C \uC88C\uC6B0\uD569\uB2C8\uB2E4.',
  },
  {
    id: 'business-speed',
    icon: '\u{1F91D}',
    title: '\uBE44\uC988\uB2C8\uC2A4 \uC18D\uB3C4',
    uae: {
      label: '\uAD00\uACC4 \uBA3C\uC800 (Wasta)',
      description: '\uC2E0\uB8B0 \uAD6C\uCD95 \u2192 \uAD00\uACC4 \u2192 \uACC4\uC57D',
      detail: 'Wasta(\uC778\uB9E5)\uAC00 \uBAA8\uB4E0 \uAC83\uC758 \uAE30\uCD08. \uCCAB \uBBF8\uD305\uC5D0\uC11C \uACC4\uC57D\uAE4C\uC9C0 6\uAC1C\uC6D4~2\uB144. \uC2DD\uC0AC \uCD08\uB300, Majlis \uCC38\uC11D \uD544\uC218.',
    },
    korea: {
      label: '\uACC4\uC57D \uBA3C\uC800',
      description: 'RFP \u2192 \uC81C\uC548 \u2192 \uACC4\uC57D \u2192 \uAD00\uACC4',
      detail: '\uACBD\uC7C1 \uC785\uCC30, \uAC00\uACA9 \uBE44\uAD50, \uACC4\uC57D\uC11C \uCCB4\uACB0 \uC911\uC2EC. \uAD00\uACC4\uB294 \uACC4\uC57D \uD6C4 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uD615\uC131.',
    },
    businessTip: '\uC11C\uB450\uB974\uC9C0 \uB9C8\uC138\uC694. UAE\uC5D0\uC11C\uB294 \uCDA9\uBD84\uD55C \uAD00\uACC4 \uAD6C\uCD95 \uC5C6\uC774 \uACC4\uC57D\uC11C\uB97C \uBA3C\uC800 \uB0B4\uBC00\uBA74 \uC5ED\uD6A8\uACFC\uC785\uB2C8\uB2E4.',
  },
  {
    id: 'labor-structure',
    icon: '\u{1F465}',
    title: '\uB178\uB3D9 \uAD6C\uC870',
    uae: {
      label: '88.5% \uC678\uAD6D\uC778',
      description: '\uC5D0\uBBF8\uB77C\uD2F0\uB294 \uAD00\uB9AC\uC9C1 \uC911\uC2EC',
      detail: '\uC778\uB3C4/\uD30C\uD0A4\uC2A4\uD0C4 \uB178\uB3D9\uC790, \uC11C\uC591\uC778 \uC804\uBB38\uC9C1, \uC5D0\uBBF8\uB77C\uD2F0 \uACBD\uC601\uC9C4. Emiratisation \uC815\uCC45\uC73C\uB85C \uC790\uAD6D\uBBFC \uACE0\uC6A9 \uC758\uBB34 \uD655\uB300 \uC911.',
    },
    korea: {
      label: '\uC790\uAD6D\uBBFC \uC911\uC2EC',
      description: '\uB0B4\uAD6D\uC778 \uC911\uC2EC \uB178\uB3D9 \uC2DC\uC7A5',
      detail: '\uC678\uAD6D\uC778 \uB178\uB3D9\uC790 \uBE44\uC728 \uC57D 5%. E-9 \uBE44\uC790 \uC911\uC2EC \uB2E8\uC21C \uB178\uBB34. \uACE0\uD559\uB825 \uC790\uAD6D\uBBFC \uC911\uC2EC \uACBD\uC81C.',
    },
    businessTip: '\uD604\uC9C0 \uD30C\uD2B8\uB108 \uCC44\uC6A9 \uC2DC \uAD6D\uC801\uBCC4 \uC5ED\uD560 \uBD84\uB2F4\uC744 \uC774\uD574\uD574\uC57C \uD569\uB2C8\uB2E4. Emiratisation \uC758\uBB34\uB3C4 \uBC18\uB4DC\uC2DC \uD655\uC778\uD558\uC138\uC694.',
  },
  {
    id: 'legal-system',
    icon: '\u{2696}',
    title: '\uBC95\uCCB4\uACC4',
    uae: {
      label: '\uC774\uC2AC\uB78C\uBC95 + \uBBFC\uBC95 \uD63C\uD569',
      description: '\uC5F0\uBC29\uBC95\uACFC \uC5D0\uBBF8\uB9AC\uD2B8\uBC95 \uBCD1\uC874',
      detail: '\uC5F0\uBC29\uBC95 + 7\uAC1C \uC5D0\uBBF8\uB9AC\uD2B8 \uC790\uCE58\uBC95. ADGM/DIFC\uB294 \uC601\uBBF8\uBC95 \uC801\uC6A9. Dubai \uD569\uBC95 \u2260 Sharjah \uD569\uBC95 (\uC8FC\uB958 \uB4F1). \uC0E4\uB9AC\uC544\uBC95\uC740 \uAC00\uC871\uBC95/\uC0C1\uC18D\uC5D0 \uC801\uC6A9.',
    },
    korea: {
      label: '\uD1B5\uC77C\uB41C \uBC95\uCCB4\uACC4',
      description: '\uB2E8\uC77C \uBC95\uCCB4\uACC4, \uC804\uAD6D \uB3D9\uC77C \uC801\uC6A9',
      detail: '\uD5CC\uBC95-\uBC95\uB960-\uBA85\uB839-\uC870\uB840 \uC704\uACC4\uC81C. \uC804\uAD6D \uB3D9\uC77C\uD55C \uBC95 \uC801\uC6A9. \uD2B9\uAD6C \uAC1C\uB150 \uC5C6\uC74C.',
    },
    businessTip: '\uBC18\uB4DC\uC2DC Free Zone/ADGM/DIFC \uAD00\uD560\uAD8C \uD655\uC778. \uC5D0\uBBF8\uB9AC\uD2B8\uBCC4 \uBC95\uB960 \uCC28\uC774\uB97C \uC0AC\uC804\uC5D0 \uD30C\uC545\uD558\uC138\uC694.',
  },
  {
    id: 'taxation',
    icon: '\u{1F4B0}',
    title: '\uC138\uAE08',
    uae: {
      label: '\uC18C\uB4DD\uC138 0%',
      description: '\uBC95\uC778\uC138 9%, VAT 5%',
      detail: '\uAC1C\uC778\uC18C\uB4DD\uC138 \uC644\uC804 \uBA74\uC138. \uBC95\uC778\uC138 9% (2023\uB144 \uB3C4\uC785, AED 375K \uCD08\uACFC\uBD84). Free Zone \uBC95\uC778\uC740 0% \uAC00\uB2A5. VAT 5% (2018\uB144 \uB3C4\uC785).',
    },
    korea: {
      label: '\uC18C\uB4DD\uC138 \uCD5C\uB300 45%',
      description: '\uBC95\uC778\uC138 9~24%, VAT 10%',
      detail: '6\uB2E8\uACC4 \uB204\uC9C4\uC138\uC728 (6%~45%). \uBC95\uC778\uC138 4\uB2E8\uACC4 (9%~24%). \uBD80\uAC00\uAC00\uCE58\uC138 10%. \uC885\uD569\uBD80\uB3D9\uC0B0\uC138, \uC99D\uC5EC\uC138 \uB4F1 \uCD94\uAC00 \uC138\uAE08.',
    },
    businessTip: 'Free Zone 법인 설립 시 0% 법인세 혜택. 단, Transfer Pricing 규정 확인 필수.',
  },
  {
    id: 'real-estate',
    icon: '🏠',
    title: '부동산/모기지',
    uae: {
      label: '외국인 LTV 최대 80%',
      description: '자유로운 외국인 부동산 소유',
      detail: '첫 주택 ≤AED 5M: LTV 80%. 첫 주택 >AED 5M: LTV 70%. 투자용: LTV 60%. 오프플랜: LTV 50%. 최대 대출기간 25년. 2025.2월부터 거래비용 선지급 의무화.',
    },
    korea: {
      label: '투기지역 LTV 40%',
      description: '규제지역 대출 제한 강화',
      detail: '서울 전역 투기과열지구 (2025.10 대책). 무주택자 LTV 40%, 유주택자 0%. 생애최초 70% (80%→하향). 15억 이하 최대 6억, 25억 초과 최대 2억.',
    },
    businessTip: 'UAE는 외국인 부동산 투자에 우호적. 한국은 강력한 규제로 대출이 어려움. UAE에서 부동산 투자 시 RERA 등록 확인 필수.',
  },
  {
    id: 'cultural-code',
    icon: '\u{1F54C}',
    title: '\uBB38\uD654 \uCF54\uB4DC',
    uae: {
      label: '\uB77C\uB9C8\uB2E8 \uC874\uC911 \uD544\uC218',
      description: '\uACF5\uACF5\uC7A5\uC18C \uD589\uB3D9 \uADDC\uBC94 \uC5C4\uACA9',
      detail: '\uB77C\uB9C8\uB2E8 \uAE30\uAC04 \uACF5\uACF5 \uC74C\uC2DD/\uC74C\uC8FC \uAE08\uC9C0. \uBCF5\uC7A5 \uADDC\uC815 (\uD2B9\uD788 \uC815\uBD80 \uAE30\uAD00). \uC655\uC2E4/\uC885\uAD50 \uBE44\uD310 \uBD88\uAC00. SNS \uD45C\uD604\uB3C4 \uBC95\uC801 \uCC98\uBC8C \uB300\uC0C1.',
    },
    korea: {
      label: '\uC0C1\uB300\uC801\uC73C\uB85C \uC790\uC720',
      description: '\uAC1C\uC778 \uD45C\uD604\uC758 \uC790\uC720 \uBCF4\uC7A5',
      detail: '\uD45C\uD604\uC758 \uC790\uC720 \uD5CC\uBC95 \uBCF4\uC7A5. \uC885\uAD50 \uAD00\uB828 \uBE44\uC988\uB2C8\uC2A4 \uC81C\uC57D \uAC70\uC758 \uC5C6\uC74C. \uBCF5\uC7A5 \uC790\uC720.',
    },
    businessTip: '\uB77C\uB9C8\uB2E8 \uAE30\uAC04 \uBBF8\uD305/\uC774\uBCA4\uD2B8 \uC77C\uC815 \uC870\uC815 \uD544\uC218. \uACF5\uACF5\uC7A5\uC18C\uC5D0\uC11C\uC758 \uD589\uB3D9\uC5D0 \uD2B9\uBCC4\uD788 \uC8FC\uC758\uD558\uC138\uC694.',
  },
] as const

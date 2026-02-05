'use client'

import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import {
  religionGroups as religionGroupsKo,
  tolerancePolicies as tolerancePoliciesKo,
  ramadanInfo as ramadanInfoKo,
  ramadanBusinessTip as ramadanBusinessTipKo,
  prayerTimes as prayerTimesKo,
  prayerEtiquette as prayerEtiquetteKo,
  fridayInfo as fridayInfoKo,
  halalInfo as halalInfoKo,
  halalInsight as halalInsightKo,
  islamicHolidays as islamicHolidaysKo,
  holidayNote as holidayNoteKo,
} from '@/data/society/religion'
import {
  religionGroups as religionGroupsEn,
  tolerancePolicies as tolerancePoliciesEn,
  ramadanInfo as ramadanInfoEn,
  ramadanBusinessTip as ramadanBusinessTipEn,
  prayerTimes as prayerTimesEn,
  prayerEtiquette as prayerEtiquetteEn,
  fridayInfo as fridayInfoEn,
  halalInfo as halalInfoEn,
  halalInsight as halalInsightEn,
  islamicHolidays as islamicHolidaysEn,
  holidayNote as holidayNoteEn,
} from '@/data/society/religion.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function ReligionComposition() {
  const religionGroups = useLocalizedData(religionGroupsKo, religionGroupsEn)
  const totalPercentage = religionGroups.reduce((sum, g) => sum + g.percentage, 0)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🕌</span>
          종교 구성
        </h3>

        <div className="mb-4 h-8 rounded-lg overflow-hidden flex">
          {religionGroups.map((group) => {
            const widthPct = (group.percentage / totalPercentage) * 100
            return (
              <div
                key={group.name}
                className="h-full flex items-center justify-center text-[9px] font-bold text-black/80 transition-all duration-300 hover:brightness-110"
                style={{ width: `${widthPct}%`, background: group.color }}
                title={`${group.name} ${group.percentage}%`}
              >
                {group.percentage >= 6 ? `${group.percentage}%` : ''}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {religionGroups.map((group) => (
            <div key={group.name} className="flex items-center gap-2 text-[11px]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: group.color }}
              />
              <span className="text-t2 font-medium">{group.name}</span>
              <span className="text-t4 font-mono">{group.percentage}%</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-accent-purple/5 border border-accent-purple/15 rounded-lg">
          <div className="text-[11px] text-t2 leading-snug">
            <span className="font-bold text-accent-purple">핵심: </span>
            UAE는 이슬람 국교이면서도 종교적 관용 정책을 추구하는 독특한 포지션.
            Ministry of Tolerance and Coexistence (관용부) 별도 존재.
          </div>
        </div>
      </div>
    </Card>
  )
}

function ToleranceCards() {
  const tolerancePolicies = useLocalizedData(tolerancePoliciesKo, tolerancePoliciesEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🕊️</span>
          종교적 관용 정책
        </h3>
        <div className="space-y-3">
          {tolerancePolicies.map((policy) => (
            <div
              key={policy.name}
              className="flex gap-3 p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <span className="text-lg shrink-0">{policy.icon}</span>
              <div>
                <div className="text-xs font-bold text-t1">{policy.name}</div>
                <div className="text-[11px] text-t3 mt-0.5 leading-snug">{policy.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function RamadanGuide() {
  const ramadanInfo = useLocalizedData(ramadanInfoKo, ramadanInfoEn)
  const ramadanBusinessTip = useLocalizedData(ramadanBusinessTipKo, ramadanBusinessTipEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🌙</span>
          라마단 (Ramadan) -- 가장 큰 영향
        </h3>
        <div className="space-y-3">
          {ramadanInfo.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[100px] shrink-0 text-[11px] font-bold text-gold">{item.label}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-accent-orange/5 border border-accent-orange/15 rounded-lg">
          <div className="flex gap-2 items-start">
            <span className="text-accent-orange text-xs shrink-0">!</span>
            <span className="text-[11px] text-t3">{ramadanBusinessTip}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PrayerTimesVisual() {
  const prayerTimes = useLocalizedData(prayerTimesKo, prayerTimesEn)
  const prayerEtiquette = useLocalizedData(prayerEtiquetteKo, prayerEtiquetteEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🕐</span>
          하루 5번 기도 (Salat)
        </h3>

        <div className="relative mb-4">
          <div className="h-2 bg-gradient-to-r from-[#1a1a3e] via-[#f59e0b]/30 via-50% to-[#1a1a3e] rounded-full" />

          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-t4">새벽</span>
            <span className="text-[9px] text-t4">정오</span>
            <span className="text-[9px] text-t4">오후</span>
            <span className="text-[9px] text-t4">일몰</span>
            <span className="text-[9px] text-t4">밤</span>
          </div>

          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${prayer.position}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-gold border-2 border-bg -mt-0.5" />
            </div>
          ))}
        </div>

        <div className="space-y-2.5 mt-6">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className="flex items-center gap-3 p-2.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="w-[70px] shrink-0">
                <div className="text-xs font-bold text-gold">{prayer.name}</div>
                <div className="text-[9px] text-t4">{prayer.nameAr}</div>
              </div>
              <div className="w-[120px] shrink-0 text-[11px] text-t2">{prayer.time}</div>
              <div className="text-[11px] text-t3 flex-1">{prayer.businessImpact}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-2.5 bg-gold/5 border border-gold/10 rounded-lg">
          <span className="text-[11px] text-t3">{prayerEtiquette}</span>
        </div>
      </div>
    </Card>
  )
}

function FridaySection() {
  const fridayInfo = useLocalizedData(fridayInfoKo, fridayInfoEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">📅</span>
          금요일 (Jumu&apos;ah) -- 이슬람의 안식일
        </h3>
        <div className="space-y-3">
          {fridayInfo.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[120px] shrink-0 text-[11px] font-bold text-accent-blue">{item.label}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function HalalSection() {
  const halalInfo = useLocalizedData(halalInfoKo, halalInfoEn)
  const halalInsight = useLocalizedData(halalInsightKo, halalInsightEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">✅</span>
          할랄 (Halal) -- 제품/식품 규제
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {halalInfo.map((item) => (
            <div
              key={item.category}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-bold text-t1">{item.category}</span>
              </div>
              <div className="text-[11px] text-t3 leading-snug">{item.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-1">K-Beauty 진출 핵심</div>
          <div className="text-[11px] text-t3">{halalInsight}</div>
        </div>
      </div>
    </Card>
  )
}

function HolidayCalendar() {
  const islamicHolidays = useLocalizedData(islamicHolidaysKo, islamicHolidaysEn)
  const holidayNote = useLocalizedData(holidayNoteKo, holidayNoteEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🗓️</span>
          주요 이슬람 공휴일
        </h3>
        <div className="space-y-3">
          {islamicHolidays.map((holiday) => (
            <div
              key={holiday.name}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-t1">{holiday.name}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-green/10 text-accent-green border border-accent-green/15">
                  {holiday.days}
                </span>
              </div>
              <div className="text-[11px] text-t4 mb-1">{holiday.timing}</div>
              <div className="text-[11px] text-t2 mb-1">{holiday.description}</div>
              <div className="text-[10px] text-gold">{holiday.businessImpact}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2.5 bg-accent-orange/5 border border-accent-orange/15 rounded-lg flex gap-2 items-start">
          <span className="text-accent-orange text-xs shrink-0">!</span>
          <span className="text-[11px] text-t3">{holidayNote}</span>
        </div>
      </div>
    </Card>
  )
}

export function ReligionSection() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ReligionComposition />
        <ToleranceCards />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <RamadanGuide />
        <PrayerTimesVisual />
      </div>
      <Collapsible
        header={
          <div className="flex items-center gap-2.5">
            <span className="text-base">📅</span>
            <span className="text-sm font-bold text-t1">금요일, 할랄, 이슬람 공휴일</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FridaySection />
          <HalalSection />
          <HolidayCalendar />
        </div>
      </Collapsible>
    </div>
  )
}

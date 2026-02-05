"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Collapsible } from "@/components/ui/Collapsible";
import {
  welfareData as welfareDataKo,
  womenStatusData as womenStatusDataKo,
  womenRightsData as womenRightsDataKo,
  womenCultureTips as womenCultureTipsKo,
  foodCultureData as foodCultureDataKo,
  localFoods as localFoodsKo,
  foodBusinessTips as foodBusinessTipsKo,
  climateData as climateDataKo,
  climateBusinessImpact as climateBusinessImpactKo,
  climateWarnings as climateWarningsKo,
} from "@/data/society/welfare-women-food";
import {
  welfareData as welfareDataEn,
  womenStatusData as womenStatusDataEn,
  womenRightsData as womenRightsDataEn,
  womenCultureTips as womenCultureTipsEn,
  foodCultureData as foodCultureDataEn,
  localFoods as localFoodsEn,
  foodBusinessTips as foodBusinessTipsEn,
  climateData as climateDataEn,
  climateBusinessImpact as climateBusinessImpactEn,
  climateWarnings as climateWarningsEn,
} from "@/data/society/welfare-women-food.en";
import { useLocalizedData } from "@/hooks/useLocalizedData";

function WelfareSection() {
  const welfareData = useLocalizedData(welfareDataKo, welfareDataEn);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🏥</span>
          복지 시스템
        </h3>
        <div className="space-y-3">
          {welfareData.map((item) => {
            const isExpanded = expandedCategory === item.category;
            return (
              <div
                key={item.category}
                className="border border-brd rounded-lg overflow-hidden hover:border-brd2 transition-all duration-200"
              >
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : item.category)
                  }
                  className="w-full p-3.5 flex items-center gap-3 bg-bg/60 text-left"
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span className="text-xs font-bold text-t1 flex-1">
                    {item.title}
                  </span>
                  <span className="text-t4 text-xs">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 animate-fade-in">
                    <ul className="space-y-1.5 mt-2">
                      {item.items.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-t3 flex gap-2"
                        >
                          <span className="text-gold shrink-0">&#x2022;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    {item.note && (
                      <div className="mt-3 p-2.5 bg-accent-orange/5 border border-accent-orange/15 rounded-lg flex gap-2 items-start">
                        <span className="text-accent-orange text-xs shrink-0">
                          !
                        </span>
                        <span className="text-[10px] text-t3">{item.note}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function WomenStatusSection() {
  const womenStatusData = useLocalizedData(
    womenStatusDataKo,
    womenStatusDataEn,
  );

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">👩‍💼</span>
          여성 지위 -- 중동 최고 수준
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {womenStatusData.map((item) => (
            <div
              key={item.metric}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-t2">
                  {item.metric}
                </span>
              </div>
              <div className="text-2xl font-bold text-gold mb-1">
                {item.value}
              </div>
              <div className="text-[10px] text-t4 leading-snug">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function WomenRightsSection() {
  const womenRightsData = useLocalizedData(
    womenRightsDataKo,
    womenRightsDataEn,
  );
  const womenCultureTips = useLocalizedData(
    womenCultureTipsKo,
    womenCultureTipsEn,
  );

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">⚖️</span>
          여성 권리 및 자유
        </h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-brd">
                <th className="text-left py-2 pr-3 text-t4 font-medium w-[100px]">
                  항목
                </th>
                <th className="text-left py-2 px-3 text-gold font-medium">
                  UAE
                </th>
                <th className="text-left py-2 pl-3 text-t4 font-medium">
                  지역 비교
                </th>
              </tr>
            </thead>
            <tbody>
              {womenRightsData.map((item) => (
                <tr key={item.topic} className="border-b border-brd/50">
                  <td className="py-2.5 pr-3 font-semibold text-t2">
                    {item.topic}
                  </td>
                  <td className="py-2.5 px-3 text-t3">{item.description}</td>
                  <td className="py-2.5 pl-3 text-t4 text-[10px]">
                    {item.comparedToRegion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-accent-purple/5 border border-accent-purple/15 rounded-lg">
          <div className="text-[11px] font-bold text-accent-purple mb-2">
            비즈니스 에티켓
          </div>
          <div className="space-y-1.5">
            {womenCultureTips.map((tip, idx) => (
              <div key={idx} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-purple shrink-0">&#x2192;</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FoodCultureSection() {
  const foodCultureData = useLocalizedData(
    foodCultureDataKo,
    foodCultureDataEn,
  );

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🍽️</span>
          음식 문화
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {foodCultureData.map((item) => (
            <div
              key={item.category}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-bold text-t1">{item.title}</span>
              </div>
              <ul className="space-y-1.5">
                {item.points.map((point, idx) => (
                  <li key={idx} className="text-[11px] text-t3 flex gap-2">
                    <span className="text-gold shrink-0">&#x2022;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LocalFoodSection() {
  const localFoods = useLocalizedData(localFoodsKo, localFoodsEn);
  const foodBusinessTips = useLocalizedData(
    foodBusinessTipsKo,
    foodBusinessTipsEn,
  );

  const mustTryFoods = localFoods.filter((f) => f.mustTry);
  const otherFoods = localFoods.filter((f) => !f.mustTry);

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🥘</span>
          로컬 음식 & 비즈니스 팁
        </h3>

        <div className="mb-4">
          <div className="text-[11px] font-bold text-gold mb-2">Must Try</div>
          <div className="grid grid-cols-2 gap-2">
            {mustTryFoods.map((food) => (
              <div
                key={food.name}
                className="p-2.5 bg-gold/5 border border-gold/15 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-t1">{food.name}</span>
                  <span className="text-[9px] text-t4 italic">
                    ({food.arabicName})
                  </span>
                </div>
                <div className="text-[10px] text-t3">{food.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-medium text-t4 mb-2">
            Other Local Foods
          </div>
          <div className="flex flex-wrap gap-2">
            {otherFoods.map((food) => (
              <div
                key={food.name}
                className="px-2.5 py-1.5 bg-bg/60 border border-brd rounded-md"
              >
                <span className="text-[10px] text-t2">{food.name}</span>
                <span className="text-[9px] text-t4 ml-1">
                  - {food.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-accent-green/5 border border-accent-green/15 rounded-lg">
          <div className="text-[11px] font-bold text-accent-green mb-2">
            비즈니스 식사 팁
          </div>
          <div className="space-y-1.5">
            {foodBusinessTips.map((tip, idx) => (
              <div key={idx} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-green shrink-0">&#x2192;</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ClimateOverview() {
  const climateData = useLocalizedData(climateDataKo, climateDataEn);

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🌡️</span>
          기후 -- 비즈니스에 큰 영향
        </h3>
        <div className="space-y-3">
          {climateData.map((season) => (
            <div
              key={season.season}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{season.icon}</span>
                  <span className="text-xs font-bold text-t1">
                    {season.season}
                  </span>
                  <span className="text-[10px] text-t4">({season.months})</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-mono text-accent-orange">
                    {season.temperature}
                  </span>
                  <span className="text-[10px] text-t4">
                    습도 {season.humidity}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-t3">{season.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 h-10 rounded-lg overflow-hidden flex">
          <div className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#f97316] flex items-center justify-center text-[9px] font-bold text-white">
            여름 (6-9)
          </div>
          <div className="w-[12%] bg-[#f59e0b] flex items-center justify-center text-[9px] font-bold text-black">
            가을
          </div>
          <div className="w-[20%] bg-gradient-to-r from-[#22c55e] to-[#10b981] flex items-center justify-center text-[9px] font-bold text-white">
            겨울 (비즈니스 시즌)
          </div>
          <div className="flex-1 bg-gradient-to-r from-[#eab308] to-[#f97316] flex items-center justify-center text-[9px] font-bold text-black">
            봄 (3-5)
          </div>
        </div>
        <div className="text-center text-[10px] text-t4 mt-1">1월 - 12월</div>
      </div>
    </Card>
  );
}

function ClimateBusinessImpactSection() {
  const climateBusinessImpact = useLocalizedData(
    climateBusinessImpactKo,
    climateBusinessImpactEn,
  );
  const climateWarnings = useLocalizedData(
    climateWarningsKo,
    climateWarningsEn,
  );

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">📊</span>
          기후의 비즈니스 시사점
        </h3>
        <div className="space-y-3 mb-4">
          {climateBusinessImpact.map((item) => (
            <div key={item.aspect} className="flex gap-3">
              <div className="w-[100px] shrink-0 text-[11px] font-bold text-gold">
                {item.aspect}
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-t2 mb-0.5">{item.impact}</div>
                <div className="text-[10px] text-accent-blue">
                  Tip: {item.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-accent-red/5 border border-accent-red/15 rounded-lg">
          <div className="text-[11px] font-bold text-accent-red mb-2">
            주의사항
          </div>
          <div className="space-y-1.5">
            {climateWarnings.map((warning, idx) => (
              <div key={idx} className="text-[10px] text-t3 flex gap-2">
                <span className="text-accent-red shrink-0">!</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function WelfareWomenFood() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <WelfareSection />
        <WomenStatusSection />
      </div>
      <WomenRightsSection />
      <div className="mt-4">
        <Collapsible
          header={
            <div className="flex items-center gap-2.5">
              <span className="text-base">🍽️</span>
              <span className="text-sm font-bold text-t1">
                음식 문화 & 기후
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <FoodCultureSection />
            <LocalFoodSection />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ClimateOverview />
            <ClimateBusinessImpactSection />
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

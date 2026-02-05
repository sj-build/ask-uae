'use client'

import { Card } from '@/components/ui/Card'
import { categoryHotIssues as categoryHotIssuesKo } from '@/data/home/category-hot-issues'
import { categoryHotIssues as categoryHotIssuesEn } from '@/data/home/category-hot-issues.en'
import type { CategoryHotIssue } from '@/data/home/category-hot-issues'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function CategoryCard({ issue }: { readonly issue: CategoryHotIssue }) {
  return (
    <Card className="group relative hover:scale-[1.01] transition-all duration-300">
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, ${issue.accentColor}, ${issue.accentColor}80, transparent)`,
        }}
      />

      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl">{issue.icon}</span>
          <h3
            className="font-display text-[15px] font-bold"
            style={{ color: issue.accentColor }}
          >
            {issue.category}
          </h3>
        </div>

        <ul className="space-y-3">
          {issue.items.map((item) => (
            <li key={item.title} className="flex items-start gap-2.5">
              <span
                className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: issue.accentColor }}
              />
              <div>
                <div className="text-[13px] font-bold text-t1 leading-snug">
                  {item.title}
                </div>
                <div className="text-[11px] text-t3 mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export function CategoryHotIssues() {
  const categoryHotIssues = useLocalizedData(categoryHotIssuesKo, categoryHotIssuesEn)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {categoryHotIssues.map((issue) => (
        <CategoryCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}

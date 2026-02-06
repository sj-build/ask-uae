'use client'

import { useRef, useState, useCallback } from 'react'

interface CardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly borderColor?: string
  readonly interactive?: boolean
  readonly glow?: boolean
}

export function Card({
  children,
  className = '',
  borderColor,
  interactive = true,
  glow = false,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }, [interactive])

  const borderStyle = borderColor
    ? { borderLeftWidth: '3px', borderLeftColor: borderColor }
    : {}

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        ...borderStyle,
        ['--mouse-x' as string]: `${mousePosition.x}%`,
        ['--mouse-y' as string]: `${mousePosition.y}%`,
      }}
      className={`
        relative
        bg-bg3/70
        border border-brd/80
        rounded-xl
        overflow-hidden
        transition-all duration-400 ease-out
        ${interactive ? 'hover:border-gold/20 hover:bg-bg3/95 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(200,164,78,0.08)] hover:-translate-y-0.5' : ''}
        ${glow ? 'gold-glow' : ''}
        ${interactive ? 'interactive-highlight' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Premium variant with animated border
export function CardPremium({
  children,
  className = '',
}: Omit<CardProps, 'borderColor' | 'interactive' | 'glow'>) {
  return (
    <div className={`
      relative
      bg-gradient-to-br from-bg3/90 to-bg3/70
      border border-gold/10
      rounded-xl
      overflow-hidden
      transition-all duration-500 ease-out
      hover:border-gold/25
      hover:shadow-[0_12px_48px_rgba(0,0,0,0.35),0_0_0_1px_rgba(200,164,78,0.1)]
      hover:-translate-y-1
      border-animated
      ${className}
    `}>
      {/* Inner gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

// Glass morphism variant
export function CardGlass({
  children,
  className = '',
}: Omit<CardProps, 'borderColor' | 'interactive' | 'glow'>) {
  return (
    <div className={`
      glass
      rounded-xl
      overflow-hidden
      transition-all duration-400 ease-out
      hover:bg-bg2/90
      hover:border-gold/15
      hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      ${className}
    `}>
      {children}
    </div>
  )
}

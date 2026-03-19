'use client'

import { categoryKeyAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { Car, CreditCard, Fuel, Gamepad2, Home, LucideIcon, Phone, PiggyBank, ShoppingBag, Utensils } from 'lucide-react'
import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { ImplicitLabelListType } from 'recharts/types/component/LabelList'
import { PieLabelRenderProps } from 'recharts/types/polar/Pie'

interface RechartsDonutChartProps {
  data: TransactionType[]
  width?: number
  height?: number
}

import { useAuth } from '@/app/hooks/use-auth'
import { cn } from '@/lib/utils'
import { ExpenseCategory } from '@/types/categories'
import { TransactionType } from '@/types/transaction'
import { atom } from 'jotai'
import { MoreHorizontal, TrendingUp } from 'lucide-react'

export const categoryIconMap: Record<ExpenseCategory, LucideIcon> = {
  [ExpenseCategory.FOOD_DRINKS]: Utensils,
  [ExpenseCategory.SHOPPING]: ShoppingBag,
  [ExpenseCategory.HOUSING]: Home,
  [ExpenseCategory.TRANSPORTATION]: Car,
  [ExpenseCategory.VEHICLE]: Fuel,
  [ExpenseCategory.LIFE_ENTERTAINMENT]: Gamepad2,
  [ExpenseCategory.COMMUNICATION_PC]: Phone,
  [ExpenseCategory.FINANCIAL_EXPENSES]: CreditCard,
  [ExpenseCategory.INVESTMENTS]: TrendingUp,
  [ExpenseCategory.OTHERS_EXPENSE]: MoreHorizontal,
  [ExpenseCategory.TRANSFER]: PiggyBank,
}

export const addTransactionCategoryAtom = atom<string | null>()

interface CustomLabelProps extends PieLabelRenderProps {
  category: string
  color: string
  currentCategoryKey: string
  onMouseEnter: (key: string) => void
  onMouseLeave: () => void
  onCategoryClick: (key: string) => void
}

const CustomLabel = ({ cx, cy, midAngle, outerRadius, percent, category, color, currentCategoryKey, onMouseEnter, onMouseLeave, onCategoryClick }: CustomLabelProps) => {
  if (cx == null || cy == null || midAngle == null || outerRadius == null || percent == null) return null

  const RADIAN = Math.PI / 180

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024

  const lineLength = isMobile ? 35 : isTablet ? 45 : 60
  const iconSpacing = isMobile ? 20 : isTablet ? 25 : 30
  const iconRadius = Number(outerRadius) + lineLength + iconSpacing

  const _cx = Number(cx)
  const _cy = Number(cy)
  const _outerRadius = Number(outerRadius)

  const angle = -midAngle * RADIAN

  const lineStartX = _cx + (_outerRadius + 8) * Math.cos(angle)
  const lineStartY = _cy + (_outerRadius + 8) * Math.sin(angle)

  const lineMidDistance = isMobile ? 25 : 35

  const lineMidX = _cx + (_outerRadius + lineMidDistance) * Math.cos(angle)
  const lineMidY = _cy + (_outerRadius + lineMidDistance) * Math.sin(angle)

  const iconX = _cx + iconRadius * Math.cos(angle)
  const iconY = _cy + iconRadius * Math.sin(angle)

  const categoryKey = category.toLowerCase() as ExpenseCategory
  const IconComponent = categoryIconMap[categoryKey] || ShoppingBag

  const iconSize = isMobile ? 18 : isTablet ? 20 : 22
  const iconRadius_size = isMobile ? 22 : isTablet ? 25 : 28
  const iconGlowRadius = isMobile ? 26 : isTablet ? 29 : 32

  return (
    <g onClick={() => onCategoryClick(categoryKey)} onMouseEnter={() => onMouseEnter(categoryKey)} onMouseLeave={onMouseLeave} style={{ pointerEvents: 'auto' }}>
      <polyline
        points={`${lineStartX},${lineStartY} ${lineMidX},${lineMidY} ${iconX},${iconY}`}
        stroke={color}
        strokeWidth={isMobile ? 2 : 3}
        fill="none"
        opacity={0.9}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      />

      <circle cx={iconX} cy={iconY} r={iconRadius_size} fill={color} stroke="white" strokeWidth={isMobile ? 3 : 4} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', cursor: 'pointer' }} />

      <circle cx={iconX} cy={iconY} r={iconGlowRadius} fill="none" stroke={color} strokeWidth={2} opacity={currentCategoryKey === categoryKey ? 1 : 0.3} />

      <foreignObject className="cursor-pointer" x={iconX - iconSize / 2} y={iconY - iconSize / 2} width={iconSize} height={iconSize}>
        <div className="flex items-center justify-center w-full h-full text-white">
          <IconComponent size={iconSize} />
        </div>
      </foreignObject>

      <text
        x={isMobile ? iconX : iconX + 60}
        y={isMobile ? iconY + 40 : iconY + 20}
        fill="#059669"
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(isMobile ? 'text-xs font-bold' : 'text-sm font-bold')}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  )
}

export default function RechartsDonutChart({ data, width, height }: RechartsDonutChartProps) {
  const { user } = useAuth()
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 })
  const [categoryKey, setCategoryKey] = useAtom(categoryKeyAtom)
  const [, setAddTransactionAtomCategory] = useAtom(addTransactionCategoryAtom)

  useEffect(() => {
    const updateScreenSize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    if (typeof window !== 'undefined') {
      updateScreenSize()
      window.addEventListener('resize', updateScreenSize)
      return () => window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  const getResponsiveDimensions = useCallback(() => {
    const sw = screenSize.width
    const sh = screenSize.height
    if (sw < 640) return { width: Math.min(sw - 40, 400), height: Math.min(sh - 200, 400), outerRadius: 80, innerRadius: 50 }
    if (sw < 1024) return { width: Math.min(sw - 80, 500), height: Math.min(sh - 150, 500), outerRadius: 110, innerRadius: 70 }
    return { width: width || 700, height: height || 700, outerRadius: 140, innerRadius: 85 }
  }, [height, width, screenSize])

  const responsiveConfig = useMemo(() => getResponsiveDimensions(), [getResponsiveDimensions])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    const expenseData = data.filter((item) => item.type === 'expense')
    let categoryTotals = expenseData.reduce(
      (acc, item) => {
        const category = item.category
        const money = parseFloat(item.money)
        acc[category] = (acc[category] || 0) + money
        return acc
      },
      {} as Record<string, number>,
    )

    const notIncluded = Object.values(ExpenseCategory).reduce(
      (acc, value) => {
        if (!(value in categoryTotals)) acc[value] = 0
        return acc
      },
      {} as Record<ExpenseCategory, number>,
    )

    categoryTotals = { ...categoryTotals, ...notIncluded }

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB']
    const expenseTotal = Object.values(categoryTotals).reduce((sum, a) => sum + a, 0)
    if (expenseTotal === 0) return []

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      id: index,
      category,
      money: amount,
      color: colors[index % colors.length],
      type: 'expense',
      percentage: ((amount / expenseTotal) * 100).toFixed(1),
    }))
  }, [data])

  const total = useMemo(() => (data ?? []).filter((item) => item.type === 'expense').reduce((sum, item) => sum + parseFloat(item.money), 0), [data])

  const nonZeroCategories = chartData.filter((d) => d.money > 0)

  const renderLabel = useCallback(
    (props: PieLabelRenderProps) => (
      <CustomLabel
        {...(props as CustomLabelProps)}
        currentCategoryKey={categoryKey}
        onMouseEnter={(key: string) => setCategoryKey(key)}
        onMouseLeave={() => setCategoryKey('')}
        onCategoryClick={(key: string) => setAddTransactionAtomCategory(key)}
      />
    ),
    [categoryKey, setCategoryKey, setAddTransactionAtomCategory],
  )

  const memoizedPie = useMemo(() => <PieChartComponent chartData={nonZeroCategories} responsive={responsiveConfig} renderLabel={renderLabel} />, [nonZeroCategories, responsiveConfig, renderLabel])

  const hoveredCategory = chartData?.find((cd) => cd.category === categoryKey)

  const zeroCategories =
    !data || data.length === 0
      ? Object.values(ExpenseCategory).map((cat, index) => {
          const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB']
          return { id: index, category: cat, money: 0, color: colors[index % colors.length], type: 'expense', percentage: '0.0' }
        })
      : chartData.filter((d) => d.money === 0)

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-full max-w-4xl mt-12">
        <div className="relative z-10 pointer-events-none">{memoizedPie}</div>
        <ZeroWrapper zeroCategories={zeroCategories} />
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center rounded-2xl bg-transparent px-2 sm:px-4">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">{hoveredCategory?.category?.replace('_', ' ') || 'Total Expenses'}</div>
            <div
              className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2 break-all"
              style={{ color: hoveredCategory?.color }}
            >
              {hoveredCategory?.money.toLocaleString() || total.toLocaleString()}
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-500">{user?.currency || 'USD'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PieChartComponent = ({
  responsive,
  chartData,
  renderLabel,
}: {
  chartData: { percentage: string; category: string; money: number; color: string; icon?: string }[]
  responsive: { width: number; height: number; outerRadius: number; innerRadius: number }
  renderLabel: (props: PieLabelRenderProps) => JSX.Element
}) => {
  return (
    <ResponsiveContainer width="100%" height={responsive.height}>
      <PieChart style={{ outline: 'none' }}>
        <Pie
          isAnimationActive={false}
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel as ImplicitLabelListType}
          outerRadius={responsive.outerRadius}
          innerRadius={responsive.innerRadius}
          paddingAngle={3}
          fill="#8884d8"
          dataKey="money"
          animationBegin={0}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="white"
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))', cursor: 'pointer', outline: 'none', pointerEvents: 'auto' }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

const ZeroWrapper = ({ zeroCategories }: { zeroCategories: { id: number; category: string; money: number; color: string; type: string; percentage: string }[] }) => {
  const [, setAddTransactionAtomCategory] = useAtom(addTransactionCategoryAtom)
  return (
    <div className="absolute inset-0 flex flex-col justify-between z-0">
      <div className="flex justify-between px-10">
        {zeroCategories.slice(0, 5).map((cat) => (
          <CategoryItem onCategoryClick={setAddTransactionAtomCategory} key={cat.category} {...cat} />
        ))}
      </div>
      <div className="flex justify-between px-4">
        <div className="flex flex-col gap-4">
          {zeroCategories.slice(5, 7).map((cat) => (
            <CategoryItem onCategoryClick={setAddTransactionAtomCategory} key={cat.category} {...cat} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {zeroCategories.slice(9).map((cat) => (
            <CategoryItem onCategoryClick={setAddTransactionAtomCategory} key={cat.category} {...cat} />
          ))}
        </div>
      </div>
      <div className="flex justify-between px-10">
        {zeroCategories.slice(9).map((cat) => (
          <CategoryItem onCategoryClick={setAddTransactionAtomCategory} key={cat.category} {...cat} />
        ))}
      </div>
    </div>
  )
}

const formatCategory = (value: string) =>
  value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const CategoryItem = ({
  category,
  color,
  onCategoryClick,
}: {
  id: number
  category: string
  money: number
  color: string
  type: string
  percentage: string
  onCategoryClick: (category: string) => void
}) => {
  const Icon = categoryIconMap[category as ExpenseCategory]
  return (
    <div onClick={() => onCategoryClick(category)} key={category} className="flex flex-col items-center cursor-pointer">
      <div className="relative flex items-center justify-center">
        <div className="absolute rounded-full" style={{ width: 52, height: 52, border: `4px solid ${color}` }} />
        <div className="absolute rounded-full bg-white" style={{ width: 44, height: 44 }} />
        <div className="relative rounded-full flex items-center justify-center shadow" style={{ width: 40, height: 40, backgroundColor: color }}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="text-xs mt-2 font-semibold" style={{ color }}>
        0.0%
      </div>
      <div className="text-xs mt-2 font-semibold" style={{ color }}>
        {formatCategory(category)}
      </div>
    </div>
  )
}

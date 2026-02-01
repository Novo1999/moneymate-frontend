'use client'

import { categoryKeyAtom } from '@/lib/atoms'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Car, CreditCard, Fuel, Gamepad2, Home, LucideIcon, Phone, PiggyBank, ShoppingBag, Utensils } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { ImplicitLabelListType } from 'recharts/types/component/LabelList'

interface RechartsDonutChartProps {
  data: TransactionType[]
  width?: number
  height?: number
}

import { transactionInfoIntervalAtom } from '@/app/(main)/components/ExpenseOverview'
import { useAuth } from '@/app/hooks/use-auth'
import { cn } from '@/lib/utils'
import { ExpenseCategory } from '@/types/categories'
import { TransactionType } from '@/types/transaction'
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

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  category,
  color,
}: {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  percent: number
  category: string
  color: string
}) => {
  const [_, setAddTransactionAtomCategory] = useAtom(addTransactionCategoryAtom)
  const [currentCategoryKey, setCategoryKey] = useAtom(categoryKeyAtom)

  const RADIAN = Math.PI / 180

  // Responsive positioning based on screen size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024

  // Adaptive spacing for different screen sizes
  const lineLength = isMobile ? 35 : isTablet ? 45 : 60
  const iconSpacing = isMobile ? 20 : isTablet ? 25 : 30
  const iconRadius = outerRadius + lineLength + iconSpacing

  // Line end point (closer to chart)
  const lineStartX = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN)
  const lineStartY = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN)

  // Intermediate point for line extension
  const lineMidDistance = isMobile ? 25 : 35
  const lineMidX = cx + (outerRadius + lineMidDistance) * Math.cos(-midAngle * RADIAN)
  const lineMidY = cy + (outerRadius + lineMidDistance) * Math.sin(-midAngle * RADIAN)

  // Icon position (farther from chart)
  const iconX = cx + iconRadius * Math.cos(-midAngle * RADIAN)
  const iconY = cy + iconRadius * Math.sin(-midAngle * RADIAN)

  const categoryKey = category.toLowerCase() as ExpenseCategory
  const IconComponent = categoryIconMap[categoryKey] || ShoppingBag

  // Responsive icon and text sizes
  const iconSize = isMobile ? 18 : isTablet ? 20 : 22
  const iconRadius_size = isMobile ? 22 : isTablet ? 25 : 28
  const iconGlowRadius = isMobile ? 26 : isTablet ? 29 : 32

  return (
    <g onClick={() => setAddTransactionAtomCategory(categoryKey)} onMouseEnter={() => setCategoryKey(categoryKey)} onMouseLeave={() => setCategoryKey('')}>
      <polyline
        points={`${lineStartX},${lineStartY} ${lineMidX},${lineMidY} ${iconX},${iconY}`}
        stroke={color}
        strokeWidth={isMobile ? 2 : 3}
        fill="none"
        opacity={0.9}
        strokeLinecap="round"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          strokeDasharray: '0',
          animation: 'drawLine 1s ease-out forwards',
        }}
      />

      {/* Responsive icon background circle */}
      <circle
        cx={iconX}
        cy={iconY}
        r={iconRadius_size}
        fill={color}
        stroke="white"
        strokeWidth={isMobile ? 3 : 4}
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          cursor: 'pointer',
        }}
      />

      {/* Outer glow circle */}
      <circle cx={iconX} cy={iconY} r={iconGlowRadius} fill="none" stroke={color} strokeWidth={2} opacity={currentCategoryKey === categoryKey ? 1 : 0.3} />

      {/* Foreign object for React icon */}
      <foreignObject className="cursor-pointer" x={iconX - iconSize / 2} y={iconY - iconSize / 2} width={iconSize} height={iconSize}>
        <div className="flex items-center justify-center w-full h-full text-white">
          <IconComponent size={iconSize} />
        </div>
      </foreignObject>

      {/* Responsive category label */}
      {/* <text
        x={iconX}
        y={iconY + (isMobile ? 40 : 50)}
        fill="#374151"
        textAnchor="middle"
        dominantBaseline="central"
        className={isMobile ? 'text-xs font-bold' : 'text-sm font-bold'}
        style={{
          textTransform: 'capitalize',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        }}
      >
        {isMobile ? category.substring(0, 8) : category}
      </text> */}

      {/* Responsive percentage label */}
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
  const transactionInfoInterval = useAtomValue(transactionInfoIntervalAtom)
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 })
  const [categoryKey] = useAtom(categoryKeyAtom)

  // Track screen size for responsive behavior
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    if (typeof window !== 'undefined') {
      updateScreenSize()
      window.addEventListener('resize', updateScreenSize)
      return () => window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  // Responsive sizing based on screen dimensions
  const getResponsiveDimensions = useCallback(() => {
    const screenWidth = screenSize.width
    const screenHeight = screenSize.height

    if (screenWidth < 640) {
      // Mobile
      return {
        width: Math.min(screenWidth - 40, 400),
        height: Math.min(screenHeight - 200, 400),
        outerRadius: 80,
        innerRadius: 50,
      }
    } else if (screenWidth < 1024) {
      // Tablet
      return {
        width: Math.min(screenWidth - 80, 500),
        height: Math.min(screenHeight - 150, 500),
        outerRadius: 110,
        innerRadius: 70,
      }
    } else {
      // Desktop
      return {
        width: width || 700,
        height: height || 700,
        outerRadius: 140,
        innerRadius: 85,
      }
    }
  }, [height, width, screenSize.height, screenSize.width])

  const responsive = useCallback(() => getResponsiveDimensions(), [getResponsiveDimensions])

  const responsiveConfig = useMemo(() => responsive(), [responsive])
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])

  const chartData = useMemo(() => {
    const expenseData = data.filter((item) => item.type === 'expense')
    const categoryTotals = expenseData.reduce(
      (acc, item) => {
        const category = item.category
        const money = parseFloat(item.money)

        if (acc[category]) {
          acc[category] += money
        } else {
          acc[category] = money
        }

        return acc
      },
      {} as Record<string, number>,
    )

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB']

    const expenseTotal = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    if (expenseTotal === 0) return []

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      id: index,
      category,
      money: amount,
      color: colors[index % colors.length],
      type: 'expense',
      percentage: ((amount / expenseTotal) * 100).toFixed(1),
    }))
  }, [data, transactionInfoInterval])

  const total = useMemo(() => data.filter((item) => item.type === 'expense').reduce((sum, item) => sum + parseFloat(item.money), 0), [data])

  const memoizedPie = useMemo(() => <PieChartComponent chartData={chartData} responsive={responsiveConfig} />, [chartData, responsiveConfig])

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border mx-4">
        <div className="text-center px-4">
          <div className="text-lg sm:text-xl font-semibold">No expense data</div>
          <div className="text-sm">Add some expenses to see the chart</div>
        </div>
      </div>
    )
  }

  const hoveredCategory = chartData?.find((cd) => cd.category === categoryKey)

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-full max-w-4xl">
        {memoizedPie}
        {/* Enhanced Center content - Mobile Responsive */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center rounded-2xl bg-transparent px-2 sm:px-4">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">{hoveredCategory?.category?.replace('_', ' ') || 'Total Expenses'}</div>
            <div
              className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2 break-all"
              style={{ color: hoveredCategory?.color }}
            >
              {/* {total.toLocaleString()} */}
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
}: {
  chartData: {
    percentage: string
    category: string
    money: number
    color: string
    icon?: string
  }[]
  responsive: {
    width: number
    height: number
    outerRadius: number
    innerRadius: number
  }
}) => {
  return (
    <ResponsiveContainer width="100%" height={responsive.height}>
      <PieChart style={{ outline: 'none' }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={CustomLabel as ImplicitLabelListType}
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
              style={{
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

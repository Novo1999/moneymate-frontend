'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { Banknote, Car, Coffee, CreditCard, Fuel, Gamepad2, Gift, GraduationCap, Heart, Home, LucideIcon, Phone, PiggyBank, Plane, Shirt, ShoppingBag, Stethoscope, Utensils } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ImplicitLabelListType } from 'recharts/types/component/LabelList'

interface ExpenseData {
  category: string
  amount: number
  color: string
  icon?: string
}

interface RechartsDonutChartProps {
  data: ExpenseData[]
  width?: number
  height?: number
}

const categoryIconMap: Record<string, LucideIcon> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Gamepad2,
  bills: Home,
  health: Stethoscope,
  travel: Plane,
  coffee: Coffee,
  fuel: Fuel,
  education: GraduationCap,
  gifts: Gift,
  credit: CreditCard,
  clothing: Shirt,
  phone: Phone,
  cash: Banknote,
  charity: Heart,
  savings: PiggyBank,
}
interface ChartDataItem extends ExpenseData {
  percentage: string
}

interface TooltipPayloadItem {
  color: string
  dataKey: string
  fill: string
  name: string
  payload: ChartDataItem
  stroke: string
  strokeWidth: number
  type: string
  unit: string
  value: number
}

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

  const categoryKey = category.toLowerCase()
  const IconComponent = categoryIconMap[categoryKey] || ShoppingBag

  // Responsive icon and text sizes
  const iconSize = isMobile ? 18 : isTablet ? 20 : 22
  const iconRadius_size = isMobile ? 22 : isTablet ? 25 : 28
  const iconGlowRadius = isMobile ? 26 : isTablet ? 29 : 32

  return (
    <g>
      {/* Extended connecting line with adaptive thickness */}
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
      <circle cx={iconX} cy={iconY} r={iconGlowRadius} fill="none" stroke={color} strokeWidth={2} opacity={0.3} />

      {/* Foreign object for React icon */}
      <foreignObject x={iconX - iconSize / 2} y={iconY - iconSize / 2} width={iconSize} height={iconSize}>
        <div className="flex items-center justify-center w-full h-full text-white">
          <IconComponent size={iconSize} />
        </div>
      </foreignObject>

      {/* Responsive category label */}
      <text
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
      </text>

      {/* Responsive percentage label */}
      <text x={iconX} y={iconY + (isMobile ? 55 : 68)} fill="#059669" textAnchor="middle" dominantBaseline="central" className={isMobile ? 'text-xs font-bold' : 'text-sm font-bold'}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  )
}

export default function RechartsDonutChart({ data, width, height }: RechartsDonutChartProps) {
  const { user } = useAuth()
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 })

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
  const getResponsiveDimensions = () => {
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
  }

  const responsive = getResponsiveDimensions()
  const isMobile = screenSize.width < 640

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

  // Calculate total and add percentage to data
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  const chartData = data.map((item) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
  }))

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-4xl">
        <ResponsiveContainer width="100%" height={responsive.height}>
          <PieChart>
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
              dataKey="amount"
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
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Enhanced Center content - Mobile Responsive */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center rounded-2xl bg-transparent px-2 sm:px-4">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Expenses</div>
            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2 break-all">
              {total.toLocaleString()}
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-500">{user?.currency || 'USD'}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Legend - Mobile Responsive */}
      <div className="mt-6 sm:mt-8 lg:mt-10 w-full max-w-6xl">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center px-4">Expense Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {chartData.map((item, index) => {
            const IconComponent = categoryIconMap[item.category.toLowerCase()] || ShoppingBag
            return (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group active:scale-95"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 4px 12px ${item.color}40`,
                    }}
                  >
                    <IconComponent size={isMobile ? 18 : 20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-gray-800 capitalize truncate group-hover:text-gray-900">{item.category}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      {item.amount.toLocaleString()} {user?.currency || 'USD'}
                    </div>
                    <div className="text-xs text-emerald-600 font-bold">{item.percentage}% of total</div>
                  </div>
                </div>

                {/* Mobile: Add progress bar */}
                <div className="mt-2 sm:mt-3 h-1 bg-gray-200 rounded-full overflow-hidden sm:hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: item.color,
                      width: `${item.percentage}%`,
                      transform: 'translateX(-100%)',
                      animation: `slideIn 0.8s ease-out ${index * 0.1}s forwards`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

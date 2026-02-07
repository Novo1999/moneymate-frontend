import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { lazy, LazyExoticComponent, Suspense, useMemo } from 'react'

const iconCache: Record<string, LazyExoticComponent<LucideIcon>> = {}
console.log("🚀 ~ iconCache:", iconCache)

const CategoryIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  const Icon = useMemo(() => {
    if (iconCache[iconName]) {
      return iconCache[iconName]
    }

    const LazyIcon = lazy(() =>
      import('lucide-react').then((module) => ({
        default: (module[iconName as keyof typeof module] || module.HelpCircle) as LucideIcon,
      })),
    )

    iconCache[iconName] = LazyIcon
    return LazyIcon
  }, [iconName])

  return (
    <Suspense fallback={<div className="w-5 h-5 animate-pulse bg-gray-200 rounded" />}>
      <Icon className={cn('w-5 h-5', className)} />
    </Suspense>
  )
}

export default CategoryIcon

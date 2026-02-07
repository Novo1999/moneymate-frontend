import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

type Props = {
  value: [number, number]
  max: number
  isLoading: boolean
  onChange: (value: [number, number]) => void
}

const RangeFilter = ({ value, max, isLoading, onChange }: Props) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 min-w-xs">
      <div className="flex items-center justify-between">
        <Label>Range</Label>
        <span className="text-muted-foreground text-sm">
          {value[0]} - {value[1]}
        </span>
      </div>
      {!isLoading && <Slider max={max} min={0} value={value} onValueChange={onChange} />}
    </div>
  )
}

export default RangeFilter

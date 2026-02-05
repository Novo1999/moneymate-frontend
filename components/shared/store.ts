import { ActiveViewModes } from "@/types/activeViewMode"
import { atom } from "jotai"
import { DateRange } from "react-day-picker"

export const activeViewAtom = atom<ActiveViewModes>('day')
export const dateRangeAtom = atom<DateRange | undefined>(undefined)

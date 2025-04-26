import * as React from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  placeholder?: string
  dateFormat?: string // default = "dd-MM-yyyy"
}

export function DatePicker({
  date,
  onDateChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = "Pick a date",
  dateFormat = "dd-MM-yyyy",
}: DatePickerProps) {
  const initialDate = date ?? new Date()
  const [calendarDate, setCalendarDate] = React.useState<Date>(initialDate)
  const [inputValue, setInputValue] = React.useState<string>("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const currentYear = new Date().getFullYear()
  const minYear = minDate?.getFullYear() ?? currentYear - 50
  const maxYear = maxDate?.getFullYear() ?? currentYear + 50

  const years = React.useMemo(() => {
    const list: number[] = []
    for (let y = maxYear; y >= minYear; y--) list.push(y)
    return list
  }, [minYear, maxYear])

  const months = React.useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    []
  )

  const handleYearChange = (year: string) => {
    const y = Number(year)
    const newDate = new Date(calendarDate)
    newDate.setFullYear(y)
    setCalendarDate(newDate)
    onDateChange(newDate)
  }

  const handleMonthChange = (month: string) => {
    const m = Number(month)
    const newDate = new Date(calendarDate)
    newDate.setMonth(m)
    setCalendarDate(newDate)
    onDateChange(newDate)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCalendarDate(selectedDate)
      setInputValue(format(selectedDate, dateFormat))
      onDateChange(selectedDate)
      setIsPopoverOpen(false)
    }
  }

  const isValidDate = (d: Date): boolean => {
    return (
      !isNaN(d.getTime()) &&
      (!minDate || d >= minDate) &&
      (!maxDate || d <= maxDate)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\//g, "-").replace(/[^0-9-]/g, "")
    const digits = raw.replace(/\D/g, "")
    let formatted = ""

    if (digits.length >= 1) formatted += digits.slice(0, 2)
    if (digits.length >= 3) formatted += "-" + digits.slice(2, 4)
    if (digits.length >= 5) formatted += "-" + digits.slice(4, 8)

    setInputValue(formatted)

    if (formatted.length === 10) {
      const [d, m, y] = formatted.split("-").map(Number)
      const parsed = new Date(y, m - 1, d)
      if (isValidDate(parsed)) {
        setCalendarDate(parsed)
        onDateChange(parsed)
      } else {
        onDateChange(undefined)
      }
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parts = inputValue.split("-")
      if (parts.length === 3) {
        const [d, m, y] = parts.map(Number)
        const parsed = new Date(y, m - 1, d)
        if (isValidDate(parsed)) {
          setCalendarDate(parsed)
          onDateChange(parsed)
          setIsPopoverOpen(false)
        } else {
          toast.error(`Invalid date. Use format ${dateFormat}`)
        }
      }
    }
  }

  React.useEffect(() => {
    const d = date ?? new Date()
    setCalendarDate(d)
    setInputValue(date ? format(d, dateFormat) : "")
  }, [date])

  React.useEffect(() => {
    if (isPopoverOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isPopoverOpen])

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className="w-full">
        <div
          className={cn(
            "w-full h-9 flex items-center border rounded-md justify-start text-left font-normal cursor-pointer focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-ring",
            !date && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          aria-label="Open date picker"
          tabIndex={0}
          onClick={() => !disabled && setIsPopoverOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              !disabled && setIsPopoverOpen(true)
            }
          }}
        >
          <CalendarIcon className="mx-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span className="text-sm">{placeholder}</span>}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={dateFormat.toLowerCase()}
            maxLength={10}
            className="w-full h-8"
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-2">
          <Select
            value={calendarDate.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={calendarDate.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={calendarDate}
          onSelect={handleDateSelect}
          disabled={(d) => {
            if (!d) return false
            if (minDate && d < minDate) return true
            if (maxDate && d > maxDate) return true
            return false
          }}
          initialFocus
          month={calendarDate}
        />
      </PopoverContent>
    </Popover>
  )
}

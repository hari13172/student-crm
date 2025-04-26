"use client"

import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export type OptionType = {
  id: string
  name: string
}

interface TagSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  label: string
}

export function TagSelect({ options, selected, onChange, placeholder = "Select options...", label }: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id))
    } else {
      onChange([...selected, id])
    }
  }

  // Remove a selected tag
  const removeTag = (id: string) => {
    onChange(selected.filter((item) => item !== id))
  }

  // Display selected tags
  const selectedTags = selected.map((id) => {
    const option = options.find((opt) => opt.id === id)
    return option ? (
      <Badge key={id} variant="secondary" className="mr-1 mb-1 bg-secondary text-foreground border border-primary">
        {option.name}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            removeTag(id)
          }}
          className="ml-1 rounded-full outline-none focus:ring focus:ring-ring focus:ring-offset"
        >
          <X className="h-[10px] w-[10px]" />
        </button>
      </Badge>
    ) : null
  })

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex flex-wrap min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${
          isOpen ? "ring-2 ring-ring ring-offset-2" : ""
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selected.length > 0 ? selectedTags : <span className="text-muted-foreground">{placeholder}</span>}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="p-2 border-t">
            <div className="font-medium text-sm mb-2">Available {label}</div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={selected.includes(option.id)}
                      onCheckedChange={() => handleCheckboxChange(option.id)}
                    />
                    <label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-2">No options found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

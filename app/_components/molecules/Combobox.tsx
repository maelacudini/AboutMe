"use client"

import * as React from "react"
import {
  Check, ChevronsUpDown 
} from "lucide-react"
import {
  Popover, PopoverContent, PopoverTrigger 
} from "../shadcn/popover"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList 
} from "../shadcn/command"
import { cn } from "@/utils/functions"
import { Button } from "../shadcn/button"

export type ComboboxData = {
  value: string,
  label: string
}

export type ComboboxPropsType = ComboboxData[]

const Combobox = ({ data, buttonLabel, inputLabel } : { data:ComboboxPropsType, buttonLabel: string, inputLabel?: string}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? data.find((data) => data.value === value)?.label
            : buttonLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder={inputLabel ? inputLabel : ''} />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
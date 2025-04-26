import * as React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CustomTimePickerProps {
    time: string | undefined; // Format: HH:mm
    onTimeChange: (time: string | undefined) => void;
}

export function TimePicker({ time, onTimeChange }: CustomTimePickerProps) {
    const [inputValue, setInputValue] = React.useState<string>("");
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Generate hours (00-23) and minutes (00-59)
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

    // Handle hour change
    const handleHourChange = (hour: string) => {
        const newTime = `${hour}:${inputValue.split(":")[1] || "00"}`;
        setInputValue(newTime);
        onTimeChange(newTime);
    };

    // Handle minute change
    const handleMinuteChange = (minute: string) => {
        const newTime = `${inputValue.split(":")[0] || "00"}:${minute}`;
        setInputValue(newTime);
        onTimeChange(newTime);
    };

    // Handle manual input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        let formattedValue = "";

        // Preserve cursor position
        const cursorPos = e.target.selectionStart || 0;
        const isCursorAtEnd = cursorPos === rawValue.length;

        // Format time as HH:mm
        if (rawValue.length >= 1) formattedValue += rawValue.slice(0, 2);
        if (rawValue.length >= 3) formattedValue += ":" + rawValue.slice(2, 4);

        setInputValue(formattedValue);

        // Restore cursor position
        setTimeout(() => {
            const newCursorPos = isCursorAtEnd ? formattedValue.length : cursorPos;
            e.target.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);

        // Validate and update time
        if (formattedValue.length === 5) {
            const [hh, mm] = formattedValue.split(":").map(Number);
            if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) {
                onTimeChange(formattedValue);
            } else {
                onTimeChange(undefined); // Reset time if invalid
            }
        }
    };

    // Handle Enter key press
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const inputValue = e.currentTarget.value;
            const isValidFormat = /^\d{2}:\d{2}$/.test(inputValue); // Ensure HH:mm format

            if (!isValidFormat) {
                e.preventDefault();
                toast.error("Invalid time format. Please enter a valid time in HH:mm format.");
                return;
            }

            const [hh, mm] = inputValue.split(":").map(Number);
            if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) {
                onTimeChange(inputValue);
                setIsPopoverOpen(false);
            } else {
                e.preventDefault();
            }
        }
    };

    // Sync inputValue with latest `time` prop
    React.useEffect(() => {
        setInputValue(time || "");
    }, [time]);

    // Auto-focus input when the popover opens
    React.useEffect(() => {
        if (isPopoverOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isPopoverOpen]);

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("min-w-[120px] h-8 justify-start text-left font-normal", !time && "text-muted-foreground")}
                    aria-label="Open time picker"
                >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {time ? time : <span>Pick a time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px] p-2 flex flex-col gap-2" align="start">
                {/* Input for manual entry */}
                <div>
                    <Input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="HH:mm"
                        maxLength={5}
                        className="w-full h-8"
                        aria-label="Enter time manually"
                    />
                </div>

                {/* Hour and Minute Selectors */}
                <div className="flex items-center justify-between">
                    <Select value={inputValue.split(":")[0] || ""} onValueChange={handleHourChange}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="text-lg">:</span>

                    <Select value={inputValue.split(":")[1] || ""} onValueChange={handleMinuteChange}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    );
}

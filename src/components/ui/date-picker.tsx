"use client";
import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar02Icon } from "hugeicons-react";

interface DatePickerProps {
  value: Date | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange: (date: any) => void;
  className?: string;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onValueChange,
  className,
  label,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild aria-label={label}>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar02Icon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd.MM.yyyy") : <span>Datum auswählen</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          lang="de"
          mode="single"
          selected={value}
          onSelect={onValueChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

"use client";
import { DateInput, DateSegment, TimeField } from "react-aria-components";
import { Time } from "../edit-match-form";

interface TimeInputProps {
  label: string;
  value: Time;
  onChange: (TimeValue: Time) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ label, ...props }) => {
  return (
    <>
      {/* @ts-expect-error idk how to do this with ts, so I am ignoring */}
      <TimeField className="space-y-2" {...props} aria-label={label}>
        <DateInput className="relative inline-flex h-10 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
            />
          )}
        </DateInput>
      </TimeField>
    </>
  );
};

export default TimeInput;

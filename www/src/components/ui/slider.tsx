import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef, Fragment, useEffect, useState } from "react";

export type SliderProps = {
    className?: string;
    min: number;
    max: number;
    minStepsBetweenThumbs: number;
    step: number;
    formatLabel?: (value: number) => string;
    value?: number[] | readonly number[];
    onValueChange?: (values: number[]) => void;
};

const Slider = forwardRef(
    (
        {
            className,
            min,
            max,
            step,
            formatLabel,
            value,
            onValueChange,
            ...props
        }: SliderProps,
        ref
    ) => {
        const initialValue = Array.isArray(value) ? value : [min, max];
        const [localValues, setLocalValues] = useState(initialValue);

        useEffect(() => {
            setLocalValues(Array.isArray(value) ? value : [min, max]);
        }, [min, max, value]);

        const handleValueChange = (newValues: number[]) => {
            setLocalValues(newValues);
            if (onValueChange) onValueChange(newValues);
        };

        return (
            <SliderPrimitive.Root
                ref={ref as React.RefObject<HTMLDivElement>}
                min={min}
                max={max}
                step={step}
                value={localValues}
                onValueChange={handleValueChange}
                className={cn(
                    "relative mb-6 flex w-full touch-none select-none items-center",
                    className
                )}
                {...props}
            >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-foreground/30">
                    <SliderPrimitive.Range className="absolute h-full bg-foreground" />
                </SliderPrimitive.Track>
                {localValues.map((value, index) => (
                    <Fragment key={index}>
                        <SliderPrimitive.Thumb className="group block size-4 rounded-full border border-foreground bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            <div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 rounded-md border bg-popover px-2 text-popover-foreground opacity-0 shadow-sm group-hover:opacity-100">
                                {formatLabel ? formatLabel(value) : value}
                            </div>
                        </SliderPrimitive.Thumb>
                    </Fragment>
                ))}
            </SliderPrimitive.Root>
        );
    }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

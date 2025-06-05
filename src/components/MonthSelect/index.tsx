"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Calendar, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useDate } from "@/contexts/DateContext";
import { MONTHS } from "@/utils/constants";

// Utilitário para classes
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// Componentes base
const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-slate-500" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className = "", children }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md max-h-60",
        className
      )}
      position="popper"
    >
      <SelectPrimitive.ScrollUpButton className="flex justify-center py-1">
        <ChevronUp className="h-4 w-4 text-slate-500" />
      </SelectPrimitive.ScrollUpButton>

      <SelectPrimitive.Viewport
        className="p-1"
        style={{ width: "var(--radix-select-trigger-width)" }}
      >
        {children}
      </SelectPrimitive.Viewport>

      <SelectPrimitive.ScrollDownButton className="flex justify-center py-1">
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className = "", ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center justify-between rounded-md px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2">
      <Check className="h-4 w-4 text-blue-600" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectValue = SelectPrimitive.Value;

// Componente MonthSelect adaptado
export const MonthSelect: React.FC = () => {
  const { selectedMonth, setMonth } = useDate();
  const currentMonth = new Date().getMonth();

  return (
    <div className="space-y-2 w-full max-w-[240px]">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        Mês
      </label>

      <Select
        value={selectedMonth.toString()}
        onValueChange={(value) => setMonth(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Escolha o mês" />
        </SelectTrigger>

        <SelectContent>
          {MONTHS.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              <div className="flex justify-between w-full">
                <span>{month}</span>
                {index === currentMonth && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ml-2">
                    Atual
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

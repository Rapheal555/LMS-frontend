import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Context for compound component
interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be used within Select');
  }
  return context;
};

// Legacy Select Props for backward compatibility
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options?: { value: string; label: string }[];
}

// New compound Select Props
interface CompoundSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

// Main Select component that supports both patterns
const Select = React.forwardRef<HTMLSelectElement, SelectProps | CompoundSelectProps>(
  (props, ref) => {
    // New compound pattern
    const { value, onValueChange, children } = props as CompoundSelectProps;
    const [open, setOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);


    // Check if it's the legacy pattern (has options prop)
    if ("options" in props && props.options) {
      const { className, error, label, options, id, ...selectProps } =
        props as SelectProps;
      const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

      return (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={selectId}
              className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <select
              id={selectId}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                "border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10",
                error &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
                className
              )}
              ref={ref}
              {...selectProps}
            >
              {options?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      );
    }

    return (
      <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        <div ref={selectRef} className="relative">
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = 'Select';

// SelectTrigger component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// SelectValue component
interface SelectValueProps {
  placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = useSelectContext();
  return <span>{value || placeholder}</span>;
};

SelectValue.displayName = 'SelectValue';

// SelectContent component
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'border-gray-200 bg-white shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

SelectContent.displayName = 'SelectContent';

// SelectItem component
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  const { onValueChange, setOpen } = useSelectContext();

  const handleClick = () => {
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <div
      className={cn(
        'relative text-gray-700 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'hover:bg-gray-200 cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
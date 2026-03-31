"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";

interface FormikCheckboxProps {
  name: string;
  label: string;
  description?: string;
  value?: boolean;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (name: string, value: boolean) => void;
}

export const FormikCheckbox = ({
  name,
  label,
  description,
  value: valueProp,
  error: errorProp,
  touched: touchedProp,
  disabled = false,
  className,
  onChange: onChangeProp,
}: FormikCheckboxProps) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  const value = valueProp !== undefined ? valueProp : values[name];
  const error = errorProp !== undefined ? errorProp : errors[name];
  const isTouched = touchedProp !== undefined ? touchedProp : touched[name];
  const onChange =
    onChangeProp ||
    ((fieldName: string, fieldValue: boolean) =>
      setFieldValue(fieldName, fieldValue));

  const hasError = isTouched && error;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={value}
          onCheckedChange={(checked) => onChange(name, checked as boolean)}
          disabled={disabled}
          className={cn(hasError && "border-destructive")}
        />
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive"
          )}>
          {label}
        </Label>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">
          <i>{description}</i>
        </p>
      )}
      {hasError && (
        <p className="text-sm text-destructive ml-6">{error as string}</p>
      )}
    </div>
  );
};

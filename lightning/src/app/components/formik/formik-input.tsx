"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";

interface FormikInputProps {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "password" | "number" | "url";
  placeholder?: string;
  value?: string | number;
  error?: string;
  description?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (name: string, value: string) => void;
}

export const FormikInput = ({
  name,
  label,
  type = "text",
  placeholder,
  value: valueProp,
  error: errorProp,
  description,
  touched: touchedProp,
  required = false,
  disabled = false,
  className,
  onChange: onChangeProp,
}: FormikInputProps) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  const value = valueProp !== undefined ? valueProp : values[name];
  const error = errorProp !== undefined ? errorProp : errors[name];
  const isTouched = touchedProp !== undefined ? touchedProp : touched[name];
  const onChange =
    onChangeProp ||
    ((fieldName: string, fieldValue: string) =>
      setFieldValue(fieldName, fieldValue));

  const hasError = isTouched && error;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={cn(hasError && "text-destructive")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">
          <i>{description}</i>
        </p>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          hasError && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {hasError && (
        <p className="text-sm text-destructive">{error as string}</p>
      )}
    </div>
  );
};

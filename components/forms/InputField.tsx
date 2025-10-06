import React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  validation,
  error,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
        <Input
          type={type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={cn("form-input", {
            "opacity-50 cursor-not-allowed": disabled,
          })}
          {...register(name, validation)}
          autoComplete="off"
        />
        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    </>
  );
};

export default InputField;

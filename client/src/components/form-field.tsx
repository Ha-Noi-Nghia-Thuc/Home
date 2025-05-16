import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
  Control,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, X, Plus } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "password"
    | "file"
    | "multi-input";
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  multiple = false,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext();

  // Common input classes for consistency
  const baseInputClass =
    "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md";

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={3}
            className={`${baseInputClass} ${inputClassName || ""}`}
            disabled={disabled}
          />
        );
      case "select":
        return (
          <Select
            value={field.value || (initialValue as string)}
            defaultValue={field.value || (initialValue as string)}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={`${baseInputClass} w-full ${inputClassName || ""}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={inputClassName}
              disabled={disabled}
            />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );
      case "file":
        return (
          <FilePond
            className={inputClassName}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file);
              field.onChange(files);
            }}
            allowMultiple={multiple}
            labelIdle={`Kéo & thả ảnh hoặc <span class="filepond--label-action">Chọn tệp</span>`}
            credits={false}
            acceptedFileTypes={accept ? [accept] : undefined}
            disabled={disabled}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`${baseInputClass} ${inputClassName || ""}`}
            disabled={disabled}
          />
        );
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
            disabled={disabled}
          />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`${baseInputClass} ${inputClassName || ""}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={`${type !== "switch" ? "rounded-md" : ""} relative ${
            className || ""
          }`}
        >
          {type !== "switch" && (
            <div className="flex justify-between items-center mb-1">
              <FormLabel className={`text-sm ${labelClassName || ""}`}>
                {label}
              </FormLabel>
              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
            </div>
          )}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};

interface MultiInputFieldProps {
  name: string;
  control: Control<FieldValues>;
  placeholder?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
  disabled = false,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`flex-1 ${inputClassName || ""}`}
                  disabled={disabled}
                />
              </FormControl>
            )}
          />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label="Xóa mục"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append("")}
        variant="outline"
        size="sm"
        className="mt-2 text-muted-foreground"
        aria-label="Thêm mục"
        disabled={disabled}
      >
        <Plus className="w-4 h-4 mr-2" />
        Thêm mục
      </Button>
    </div>
  );
};

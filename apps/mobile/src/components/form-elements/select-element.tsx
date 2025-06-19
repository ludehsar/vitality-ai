import { TextInputProps } from 'react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import { Controller, useFormContext } from 'react-hook-form';
import { ChevronDownIcon, InfoIcon } from '../ui/icon';
import {
  Select,
  SelectDragIndicator,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectPortal,
  SelectTrigger,
  SelectItem,
} from '../ui/select';

export interface SelectElementProps extends TextInputProps {
  label?: string;
  helperText?: string;
  name: string;
  options: { label: string; value: string }[];
}

const SelectElement: React.FC<SelectElementProps> = ({
  label,
  helperText,
  name,
  options,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <FormControl
          isDisabled={field.disabled}
          isInvalid={fieldState.invalid}
          isReadOnly={fieldState.isValidating}
        >
          {label && (
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
          )}
          <Select onValueChange={onChange} selectedValue={field.value}>
            <SelectTrigger>
              <SelectInput {...props} />
              <SelectIcon as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
          {helperText && (
            <FormControlHelper>
              <FormControlHelperText>{helperText}</FormControlHelperText>
            </FormControlHelper>
          )}
          {fieldState.error && (
            <FormControlError>
              <FormControlErrorIcon as={InfoIcon} />
              <FormControlErrorText>
                {fieldState.error.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectElement;

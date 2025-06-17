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
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '../ui/radio';

export interface RadioElementProps {
  label: string;
  helperText?: string;
  name: string;
  options: { label: string; value: string }[];
}

const RadioElement: React.FC<RadioElementProps> = ({
  label,
  helperText,
  name,
  options,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          isDisabled={field.disabled}
          isInvalid={fieldState.invalid}
          isReadOnly={fieldState.isValidating}
        >
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
          <RadioGroup {...field}>
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                <RadioIndicator>
                  <RadioIcon />
                </RadioIndicator>
                <RadioLabel>{option.label}</RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
          {helperText && (
            <FormControlHelper>
              <FormControlHelperText>{helperText}</FormControlHelperText>
            </FormControlHelper>
          )}
          {fieldState.error && (
            <FormControlError>
              <FormControlErrorIcon />
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

export default RadioElement;

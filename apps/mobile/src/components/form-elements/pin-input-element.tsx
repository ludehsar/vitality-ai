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
import { InfoIcon } from '../ui/icon';
import { PinInput, PinInputField } from '../ui/pin-input';

export interface InputElementProps extends TextInputProps {
  label?: string;
  helperText?: string;
  name: string;
  isPassword?: boolean;
  length: number;
}

const PinInputElement: React.FC<InputElementProps> = ({
  label,
  helperText,
  name,
  isPassword = false,
  length,
  ...props
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
          {label && (
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
          )}
          <PinInput>
            {Array.from({ length }).map((_, index) => (
              <PinInputField
                key={index}
                index={index}
                secureTextEntry={isPassword}
                {...props}
                {...field}
                onChangeText={field.onChange}
              />
            ))}
          </PinInput>
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

export default PinInputElement;

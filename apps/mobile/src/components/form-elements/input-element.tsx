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
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from '../ui/icon';
import { useState } from 'react';

export interface InputElementProps extends TextInputProps {
  label?: string;
  helperText?: string;
  name: string;
  isPassword?: boolean;
}

const InputElement: React.FC<InputElementProps> = ({
  label,
  helperText,
  name,
  isPassword = false,
  ...props
}) => {
  const { control } = useFormContext();
  const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(
    isPassword ? false : true
  );

  const toggleShouldShowPassword = () => {
    setShouldShowPassword((prevState) => !prevState);
  };

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
          <Input>
            <InputField
              secureTextEntry={isPassword && !shouldShowPassword}
              {...props}
              {...field}
              onChangeText={field.onChange}
            />
            {isPassword && (
              <InputSlot className="pr-3" onPress={toggleShouldShowPassword}>
                <InputIcon as={shouldShowPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            )}
          </Input>
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

export default InputElement;

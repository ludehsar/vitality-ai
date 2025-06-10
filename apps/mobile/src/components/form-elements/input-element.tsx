import { Controller, useFormContext } from 'react-hook-form';
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
import { Input } from '../ui/input';

export type InputElementProps = {
  name: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
};

const InputElement = ({
  name,
  label,
  helperText,
  errorMessage,
}: InputElementProps) => {
  const { control } = useFormContext();

  return (
    <FormControl>
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => <Input {...field} />}
      />
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}
      {errorMessage && (
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default InputElement;

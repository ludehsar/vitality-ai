import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import { ConfirmResetPasswordProps } from '@aws-amplify/ui-react-native';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';
import React from 'react';

export const ConfirmResetPasswordScreen: React.FC<
  ConfirmResetPasswordProps
> = ({
  error: errorMessage,
  fields,
  handleSubmit,
  isPending,
  resendCode,
  validationErrors,
  hasValidationErrors,
}) => {
  const form = useForm({
    defaultValues: fields.map((field) => ({
      [field.name]: field.value,
    })),
  });

  React.useEffect(() => {
    if (hasValidationErrors && validationErrors) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        form.setError(key as `${number}.${string}`, {
          message: Array.isArray(value) ? value.join(', ') : value,
        });
      });
    }
  }, [hasValidationErrors, validationErrors]);

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Confirm Reset Password</Heading>
        {fields.map(({ name, label, type, ...field }) => (
          <InputElement
            key={name}
            name={name}
            label={label}
            isPassword={type === 'password'}
            {...field}
          />
        ))}
        <Button
          className="mt-4"
          onPress={form.handleSubmit(handleSubmit)}
          disabled={isPending}
        >
          {isPending && <ButtonSpinner />}
          <ButtonText>{isPending ? 'Submitting...' : 'Confirm'}</ButtonText>
        </Button>
        {errorMessage && (
          <Alert action="error" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>{errorMessage}</AlertText>
          </Alert>
        )}
        <HStack className="justify-between">
          <Button variant="link" onPress={resendCode}>
            <ButtonText>Resend Code</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

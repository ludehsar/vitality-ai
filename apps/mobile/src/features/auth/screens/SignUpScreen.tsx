import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { HStack } from '../../../components/ui/hstack';
import { SignUpProps } from '@aws-amplify/ui-react-native';
import React from 'react';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';

export const SignUpScreen: React.FC<SignUpProps> = ({
  error: errorMessage,
  fields,
  handleSubmit,
  isPending,
  toSignIn,
  hasValidationErrors,
  validationErrors,
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
        <Heading>Sign Up</Heading>
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
          <ButtonText>{isPending ? 'Submitting...' : 'Sign Up'}</ButtonText>
        </Button>
        {errorMessage && (
          <Alert action="error" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>{errorMessage}</AlertText>
          </Alert>
        )}
        <HStack className="justify-between">
          <Button variant="link" onPress={toSignIn}>
            <ButtonText>Already have an account?</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

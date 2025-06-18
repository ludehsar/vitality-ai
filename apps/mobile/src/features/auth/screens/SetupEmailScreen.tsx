import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import InputElement from '../../../components/form-elements/input-element';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { SetupEmailProps } from '@aws-amplify/ui-react-native';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';
import { HStack } from '../../../components/ui/hstack/index.web';

export const SetupEmailScreen: React.FC<SetupEmailProps> = ({
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
        <Heading>Setup Email</Heading>
        {fields.map(({ name, label, type, ...field }) => (
          <InputElement
            key={name}
            name={name}
            label={label}
            isPassword={type === 'password'}
            {...field}
          />
        ))}
        <Button onPress={form.handleSubmit(handleSubmit)} disabled={isPending}>
          {isPending && <ButtonSpinner />}
          <ButtonText>{isPending ? 'Submitting...' : 'Continue'}</ButtonText>
        </Button>
        {errorMessage && (
          <Alert action="error" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>{errorMessage}</AlertText>
          </Alert>
        )}
        <HStack className="justify-between">
          <Button variant="link" onPress={toSignIn}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

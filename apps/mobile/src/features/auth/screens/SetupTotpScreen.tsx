import React from 'react';

import { useForm } from 'react-hook-form';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import InputElement from '../../../components/form-elements/input-element';
import { SetupTotpProps } from '@aws-amplify/ui-react-native';
import { Divider } from '../../../components/ui/divider';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';

export const SetupTotpScreen: React.FC<SetupTotpProps> = ({
  error: errorMessage,
  fields,
  handleSubmit,
  isPending,
  toSignIn,
  totpSecretCode,
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
    <VStack>
      <Heading>Setup TOTP</Heading>
      <Text>
        Copy and paste the secret key below into an authenticator app and then
        enter the code in the text field below.
      </Text>
      <Divider />
      <Text selectable className="text-xl font-semibold">
        {totpSecretCode}
      </Text>
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
        <Button variant="link" onPress={toSignIn}>
          <ButtonText>Back to Sign In</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

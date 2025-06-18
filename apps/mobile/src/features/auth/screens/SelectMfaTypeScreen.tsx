import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import RadioElement from '../../../components/form-elements/radio-element';
import { HStack } from '../../../components/ui/hstack';
import { SelectMfaTypeProps } from '@aws-amplify/ui-react-native';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';

export const SelectMfaTypeScreen: React.FC<SelectMfaTypeProps> = ({
  error: errorMessage,
  fields,
  handleSubmit,
  isPending,
  toSignIn,
}) => {
  const form = useForm();

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Select MFA Type</Heading>
        <RadioElement
          name="mfa_type"
          label="Select MFA Type"
          options={fields.map(({ value, label }) => ({
            label: label ?? '',
            value: value,
          }))}
        />
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
        <HStack>
          <Button variant="link" onPress={toSignIn}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

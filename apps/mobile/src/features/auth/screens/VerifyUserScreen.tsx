import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { FormProvider, useForm } from 'react-hook-form';
import { HStack } from '../../../components/ui/hstack';
import RadioElement from '../../../components/form-elements/radio-element';
import { VerifyUserProps } from '@aws-amplify/ui-react-native';
import React from 'react';
import { Alert, AlertIcon, AlertText } from '../../../components/ui/alert';
import { InfoIcon } from '../../../components/ui/icon';
import { censorContactMethod, ContactMethod } from '@aws-amplify/ui';

interface AttributeMap {
  email: ContactMethod;
  phone_number: ContactMethod;
}

const attributeMap: AttributeMap = {
  email: 'Email',
  phone_number: 'Phone Number',
};

export const VerifyUserScreen: React.FC<VerifyUserProps> = ({
  error: errorMessage,
  fields,
  handleSubmit,
  isPending,
  skipVerification,
}) => {
  const form = useForm({
    defaultValues: {
      unverifiedAttr: null,
    },
  });

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Verify User</Heading>
        <RadioElement
          name="unverifiedAttr"
          label="Unverified User Attribute"
          options={fields.map(({ value, name }) => {
            const attributeType = attributeMap[name as keyof AttributeMap];
            return {
              label: `${attributeType}: ${censorContactMethod(
                attributeType,
                value
              )}`,
              value: name,
            };
          })}
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(handleSubmit)}
          disabled={isPending}
        >
          {isPending && <ButtonSpinner />}
          <ButtonText>{isPending ? 'Submitting...' : 'Send Code'}</ButtonText>
        </Button>
        {errorMessage && (
          <Alert action="error" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>{errorMessage}</AlertText>
          </Alert>
        )}
        <HStack className="justify-between">
          <Button variant="link" onPress={skipVerification}>
            <ButtonText>Skip Verification</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

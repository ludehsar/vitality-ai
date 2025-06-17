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
import { AuthError, confirmSignIn } from 'aws-amplify/auth';
import { useHandleAuthenticationNextStep } from '../hooks/useHandleAuthenticationNextStep';
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';

const errorMessages = {
  UserNotConfirmedException: {
    field: 'email',
    message: 'User is not confirmed',
  },
  UserNotFoundException: { field: 'email', message: 'User not found' },
  NotAuthorizedException: {
    field: 'email',
    message: 'Not authorized',
  },
};

export const SetupEmailScreen = () => {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });
  const { handleSignInNextStep } = useHandleAuthenticationNextStep();

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await confirmSignIn({ challengeResponse: data.email });
      handleSignInNextStep(response.nextStep);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof typeof form.formState.errors, {
          message,
        });
      } else {
        form.setError('email', { message: 'An unknown error occurred' });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Confirm Sign In</Heading>
        <InputElement
          name="email"
          label="Email"
          placeholder="Enter Email"
          keyboardType="email-address"
        />
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Continue</ButtonText>
        </Button>
      </VStack>
    </FormProvider>
  );
};

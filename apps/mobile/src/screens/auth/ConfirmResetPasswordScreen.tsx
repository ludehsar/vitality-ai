import InputElement from '../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AuthError,
  confirmResetPassword,
  ConfirmResetPasswordInput,
  resendSignUpCode,
} from 'aws-amplify/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  confirmResetPasswordSchema,
  ConfirmResetPasswordSchema,
} from './_schema/auth.schema';
import { VStack } from '../../components/ui/vstack';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Button, ButtonSpinner, ButtonText } from '../../components/ui/button';
import { HStack } from '../../components/ui/hstack';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

const errorMessages = {
  InvalidPasswordException: {
    field: 'newPassword',
    message: 'Invalid password',
  },
  InvalidParameterException: {
    field: 'code',
    message: 'Invalid code',
  },
  ExpiredCodeException: {
    field: 'code',
    message: 'Code expired',
  },
};

export const ConfirmResetPasswordScreen = () => {
  const { codeDeliveryDetails, username } = useAuthenticator();
  const form = useForm<ConfirmResetPasswordSchema>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ConfirmResetPasswordSchema) => {
    if (!username) return;
    if (data.newPassword !== data.confirmNewPassword) {
      form.setError('confirmNewPassword', {
        message: 'Passwords do not match',
      });
      return;
    }
    const requestData: ConfirmResetPasswordInput = {
      confirmationCode: data.code,
      newPassword: data.newPassword,
      username,
    };
    try {
      await confirmResetPassword(requestData);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof ConfirmResetPasswordSchema, {
          message,
        });
      } else {
        form.setError('code', {
          message: 'An unknown error occurred',
        });
      }
    }
  };

  const handleResendCode = async () => {
    if (username) {
      const response = await resendSignUpCode({ username });
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>
          Verify{' '}
          {codeDeliveryDetails?.AttributeName === 'email'
            ? 'Email'
            : 'Phone Number'}
        </Heading>
        <Text>
          A code has been sent to {codeDeliveryDetails?.Destination} via{' '}
          {codeDeliveryDetails?.DeliveryMedium}
        </Text>

        <InputElement name="code" label="Code" />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Confirm</ButtonText>
        </Button>
        {username && (
          <HStack className="justify-between">
            <Button variant="link" onPress={handleResendCode}>
              <ButtonText>Resend Code</ButtonText>
            </Button>
          </HStack>
        )}
      </VStack>
    </FormProvider>
  );
};

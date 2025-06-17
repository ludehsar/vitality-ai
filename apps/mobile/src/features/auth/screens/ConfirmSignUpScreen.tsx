import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AuthError,
  confirmSignUp,
  ConfirmSignUpInput,
  resendSignUpCode,
} from 'aws-amplify/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConfirmSignUpSchema,
  confirmSignUpSchema,
} from '../schema/auth.schema';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import { useHandleAuthenticationNextStep } from '../hooks/useHandleAuthenticationNextStep';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  CodeMismatchException: {
    field: 'code',
    message: 'Invalid code',
  },
  ExpiredCodeException: {
    field: 'code',
    message: 'Code expired',
  },
  LimitExceededException: {
    field: 'code',
    message: 'Code limit exceeded',
  },
  NotAuthorizedException: {
    field: 'code',
    message: 'Not authorized',
  },
};

export type ConfirmSignUpScreenProps = {
  route: RouteProp<RootStackParamList, 'ConfirmSignUp'>;
};

export const ConfirmSignUpScreen = ({
  route: {
    params: { codeDeliveryDetails, username },
  },
}: ConfirmSignUpScreenProps) => {
  const { handleSignUpNextStep } = useHandleAuthenticationNextStep();
  const form = useForm<ConfirmSignUpSchema>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: ConfirmSignUpSchema) => {
    if (!username) return;
    const requestData: ConfirmSignUpInput = {
      confirmationCode: data.code,
      username,
    };
    try {
      const response = await confirmSignUp(requestData);
      handleSignUpNextStep(response.nextStep);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof typeof form.formState.errors, {
          message,
        });
      } else {
        form.setError('code', { message: 'An unknown error occurred' });
      }
    }
  };

  const handleResendCode = async () => {
    if (!username) return;
    try {
      await resendSignUpCode({ username });
    } catch (error) {
      console.error(error);
      form.setError('code', { message: 'An unknown error occurred' });
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>
          Verify{' '}
          {codeDeliveryDetails?.attributeName === 'email'
            ? 'Email'
            : 'Phone Number'}
        </Heading>
        <Text>
          A code has been sent to {codeDeliveryDetails?.destination} via{' '}
          {codeDeliveryDetails?.deliveryMedium}
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

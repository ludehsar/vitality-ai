import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AuthError,
  confirmSignIn,
  ConfirmSignInInput,
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
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
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
};

export type ConfirmSignInWithCodeScreenProps = {
  route: RouteProp<RootStackParamList, 'ConfirmSignInWithCode'>;
};

export const ConfirmSignInWithCodeScreen = ({
  route: {
    params: { codeDeliveryDetails, username },
  },
}: ConfirmSignInWithCodeScreenProps) => {
  const { handleSignInNextStep } = useHandleAuthenticationNextStep();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const form = useForm<ConfirmSignUpSchema>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: ConfirmSignUpSchema) => {
    const requestData: ConfirmSignInInput = {
      challengeResponse: data.code,
    };
    try {
      const response = await confirmSignIn(requestData);
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
        form.setError('code', { message: 'An unknown error occurred' });
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendSignUpCode({
        username,
      });
      navigation.navigate('ConfirmSignInWithCode', {
        codeDeliveryDetails: response,
        username,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Verify Code</Heading>
        {codeDeliveryDetails && (
          <Text>
            A code has been sent to {codeDeliveryDetails.destination} via{' '}
            {codeDeliveryDetails.deliveryMedium}
          </Text>
        )}

        <InputElement
          name="code"
          label="Code"
          placeholder="Enter Code"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Confirm</ButtonText>
        </Button>
        {codeDeliveryDetails.destination && (
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

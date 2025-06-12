import InputElement from '../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import {
  confirmSignUp,
  ConfirmSignUpInput,
  resendSignUpCode,
} from 'aws-amplify/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConfirmSignUpSchema,
  confirmSignUpSchema,
} from './_schema/auth.schema';
import { VStack } from '../../components/ui/vstack';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Button, ButtonSpinner, ButtonText } from '../../components/ui/button';
import { HStack } from '../../components/ui/hstack';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

export const ConfirmSignUpScreen = () => {
  const { codeDeliveryDetails, username } = useAuthenticator();
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
    } catch (error) {
      console.error(error);
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

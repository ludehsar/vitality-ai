import { VStack } from '../../components/ui/vstack';
import { Button, ButtonSpinner, ButtonText } from '../../components/ui/button';
import { Heading } from '../../components/ui/heading';
import InputElement from '../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { resetPassword, ResetPasswordInput } from 'aws-amplify/auth';
import { HStack } from '../../components/ui/hstack';
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from './_schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const ForgotPasswordScreen = () => {
  const { toSignIn } = useAuthenticator();
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const requestData: ResetPasswordInput = {
      username: data.email,
    };
    try {
      const response = await resetPassword(requestData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Forgot Password</Heading>
        <InputElement
          name="email"
          label="Email"
          placeholder="Enter Email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Sign In</ButtonText>
        </Button>
        <HStack className="justify-between">
          <Button variant="link" onPress={toSignIn}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

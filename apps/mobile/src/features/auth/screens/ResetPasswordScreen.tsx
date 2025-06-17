import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthError, resetPassword, ResetPasswordInput } from 'aws-amplify/auth';
import { HStack } from '../../../components/ui/hstack';
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHandleAuthenticationNextStep } from '../hooks/useHandleAuthenticationNextStep';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  UserNotFoundException: {
    field: 'email',
    message: 'User not found',
  },
  NotAuthorizedException: {
    field: 'email',
    message: 'Not authorized',
  },
};

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { handleResetPasswordNextStep } = useHandleAuthenticationNextStep();
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    const requestData: ResetPasswordInput = {
      username: data.email,
    };
    try {
      const response = await resetPassword(requestData);
      handleResetPasswordNextStep(response.nextStep);
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
          <ButtonText>Send Code</ButtonText>
        </Button>
        <HStack className="justify-between">
          <Button variant="link" onPress={() => navigation.navigate('SignIn')}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

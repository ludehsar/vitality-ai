import { VStack } from '../../components/ui/vstack';
import { Button, ButtonSpinner, ButtonText } from '../../components/ui/button';
import { Heading } from '../../components/ui/heading';
import InputElement from '../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { signInSchema, SignInSchema } from './_schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, signIn, SignInInput } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { HStack } from '../../components/ui/hstack';

const errorMessages = {
  UserNotConfirmedException: {
    field: 'email',
    message: 'User is not confirmed',
  },
  UserNotFoundException: { field: 'email', message: 'User not found' },
  NotAuthorizedException: {
    field: 'password',
    message: 'Invalid email or password',
  },
};

export const SignInScreen = () => {
  const { toSignUp, toForgotPassword } = useAuthenticator();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    const requestInput: SignInInput = {
      username: data.email,
      password: data.password,
    };
    try {
      const response = await signIn(requestInput);
    } catch (error) {
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof SignInSchema, {
          message,
        });
      } else {
        form.setError('email', {
          message: 'An unknown error occurred',
        });
      }
      console.error('Error signing in', error);
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Sign In</Heading>
        <InputElement
          name="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          label="Email"
          placeholder="Enter Email"
        />
        <InputElement
          name="password"
          label="Password"
          keyboardType="visible-password"
          textContentType="password"
          placeholder="Enter Password"
          isPassword
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
          <Button variant="link" onPress={toForgotPassword}>
            <ButtonText>Forgot Password?</ButtonText>
          </Button>
          <Button variant="link" onPress={toSignUp} className="text-primary">
            <ButtonText>Create an account</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};

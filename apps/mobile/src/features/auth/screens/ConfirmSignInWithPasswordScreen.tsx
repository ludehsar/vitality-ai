import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthError, confirmSignIn, ConfirmSignInInput } from 'aws-amplify/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  confirmSignInWithPasswordSchema,
  ConfirmSignInWithPasswordSchema,
} from '../schema/auth.schema';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
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

export type ConfirmSignInWithPasswordScreenProps = {
  route: RouteProp<RootStackParamList, 'ConfirmSignInWithPassword'>;
};

const errorMessages = {
  PasswordResetRequiredException: {
    field: 'password',
    message: 'Password reset required',
  },
  NotAuthorizedException: {
    field: 'password',
    message: 'Invalid password',
  },
  UserNotConfirmedException: {
    field: 'password',
    message: 'User not confirmed',
  },
  UserNotFoundException: {
    field: 'password',
    message: 'User not found',
  },
  LimitExceededException: {
    field: 'password',
    message: 'Password limit exceeded',
  },
};

export const ConfirmSignInWithPasswordScreen = ({
  route: {
    params: { challengeName },
  },
}: ConfirmSignInWithPasswordScreenProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { handleSignInNextStep } = useHandleAuthenticationNextStep();
  const form = useForm<ConfirmSignInWithPasswordSchema>({
    resolver: zodResolver(confirmSignInWithPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ConfirmSignInWithPasswordSchema) => {
    if (
      challengeName === 'NEW_PASSWORD_REQUIRED' &&
      data.confirmPassword !== data.password
    ) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    const requestData: ConfirmSignInInput = {
      challengeResponse: data.password,
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
        form.setError('password', { message: 'An unknown error occurred' });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Verify Password</Heading>

        <InputElement
          name="password"
          label="Password"
          placeholder="Enter Password"
          keyboardType="visible-password"
          textContentType="password"
          isPassword
        />
        {challengeName === 'NEW_PASSWORD_REQUIRED' && (
          <InputElement
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Enter Confirm Password"
            keyboardType="visible-password"
            textContentType="password"
            isPassword
          />
        )}
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Confirm</ButtonText>
        </Button>
        <HStack>
          <Button variant="link" onPress={() => navigation.navigate('SignIn')}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
